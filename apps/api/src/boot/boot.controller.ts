import type { IAppConfig, ISwaggerConfig } from '@/config'
import { Controller, Get, Render } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiController, ApiMethod, IsNoFormat, IsPublic } from '@/common/deco'
import { CacheService } from '@/common/infra'
import { APP_CONFIG_KEY, SWAGGER_CONFIG_KEY } from '@/config'

@Controller()
@ApiController({ ApiTagsOptions: ['跳转swagger文档'] })
export class BootController {
  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {}

  static readonly BOOT_START_TIME = 'BOOT_START_TIME'
  @IsPublic()
  @Get()
  @Render('page/index')
  @IsNoFormat()
  @ApiMethod({ ApiOperationOptions: [{ summary: '跳转swagger文档' }] })
  async boot() {
    const { name } = this.configService.get<IAppConfig>(APP_CONFIG_KEY)!
    const {
      enabled,
      config: { path },
    } = this.configService.get<ISwaggerConfig>(SWAGGER_CONFIG_KEY)!

    const startTime = (await this.cacheService.get(BootController.BOOT_START_TIME)) || '未知'
    return { name, enabled, path, startTime }
  }

  @IsPublic()
  @Get('set-str')
  async setStr() {
    await this.cacheService.set('str', 'str', 5 * 60 * 1000)
    return []
  }

  @IsPublic()
  @Get('get-str')
  async getStr() {
    return await this.cacheService.get<string>('str')
  }

  @IsPublic()
  @Get('del-str')
  async delStr() {
    await this.cacheService.del('str')
    return []
  }

  @IsPublic()
  @Get('update-str')
  async updateStr() {
    await this.cacheService.update('str', 'test')
    return []
  }

  @IsPublic()
  @Get('set-arr')
  async setArr() {
    await this.cacheService.set('arr', ['test', 1, 2, 3, ['test']], 5 * 60 * 1000)
    return []
  }

  @IsPublic()
  @Get('get-obj')
  async getArr() {
    return await this.cacheService.get('obj')
  }

  @IsPublic()
  @Get('del-obj')
  async delArr() {
    await this.cacheService.del('obj')
    return []
  }

  @IsPublic()
  @Get('set-obj')
  async setObj() {
    await this.cacheService.set(
      'obj',
      {
        haha: true,
        a: 120,
      },
      5 * 60 * 1000,
    )
    return []
  }

  @IsPublic()
  @Get('get-obj')
  async getObj() {
    return await this.cacheService.get('obj')
  }

  @IsPublic()
  @Get('del-obj')
  async delObj() {
    await this.cacheService.del('obj')
    return []
  }

  @IsPublic()
  @Get('put-obj')
  async putObj() {
    await this.cacheService.update('obj', 1)
    return []
  }

  @IsPublic()
  @Get('dd-obj')
  async ddObj() {
    await this.cacheService.delayedDel('obj', 5000)
    return []
  }
}
