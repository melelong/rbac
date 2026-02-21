import type { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import type { IOrmConfig } from '@/config'
import { Global, Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { createPool } from 'mysql2/promise'
import { ORM_CONFIG_KEY } from '@/config'
/** 创建mysql数据库配置 */
export interface ICreateMysqlDatabaseOptions {
  /** mysql配置 */
  config: MysqlConnectionOptions
  /** 日志服务 */
  logger: Logger
}

/** 数据库模块 */
@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<IOrmConfig>(ORM_CONFIG_KEY)!
        await OrmModule.createMysqlDB({
          config: config as MysqlConnectionOptions,
          logger: new Logger(OrmModule.name),
        })
        return config
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class OrmModule {
  /**
   * 创建mysql数据库
   * @param options 创建mysql数据库配置
   */
  public static async createMysqlDB(options: ICreateMysqlDatabaseOptions) {
    const { config, logger } = options
    try {
      const { host, username: user, password, database } = config!
      const pool = createPool({
        host,
        user,
        password,
      })
      pool.on('connection', (connection) => {
        logger.log(`${connection.threadId} 新建连接`)
        connection.on('error', (err) => logger.error(`${connection.threadId} 错误: ${err.message}`, err.stack))
        connection.on('connect', () => logger.log(`${connection.threadId} 连接成功`))
        connection.on('end', () => logger.log(`${connection.threadId} 连接已关闭`))
      })
      pool.on('acquire', (connection) => logger.log(`${connection.threadId} 获取连接成功`))
      pool.on('enqueue', () => logger.log(`连接中...`))
      pool.on('release', async (connection) => {
        logger.log(` ${connection.threadId} 手动释放连接中`)
        connection.destroy()
      })
      const connection = await pool.getConnection()
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci`)
      logger.log(`创建数据库 ${database} 成功`)
      const [nowMsg] = await connection.query(`SELECT NOW()`)
      logger.log(`数据库时间:${nowMsg[0]['NOW()']}`)
      connection.release()
    } catch (err) {
      logger.error(`错误: ${err.message}`, err.stack)
    }
  }
}
