import type { EntityManager, EntityTarget, FindOptionsWhere, ObjectLiteral } from 'typeorm'

/** 业务模板抽象类配置接口 */
export interface IBusinessTemplateOptions {
  /** 应用模板的类名 */
  className: string
}

/** 事务模板参数接口 */
export interface ITransactionTemplateOptions<T, R> {
  /**
   * 业务逻辑
   * @param em 实体管理对象
   * @param validateValue 验证逻辑返回值
   */
  handler: (em: EntityManager, validateValue?: R | void) => Promise<T>
  /**
   * 验证逻辑
   * @param em 实体管理对象
   */
  validate?: (em: EntityManager) => Promise<R | void>
}

/** 事务模板策略接口 */
export interface ITransactionTemplateStrategy<T, R> {
  /**
   * 业务逻辑
   * @param em 实体管理对象
   * @param validateValue 验证逻辑返回值
   */
  handler: (em: EntityManager, validateValue?: R) => Promise<T>
  /**
   * 验证逻辑
   * @param em 实体管理对象
   */
  validate?: (em: EntityManager) => Promise<R | void>
}

/** 查找单个模板参数接口 */
export interface IFindOneTemplateOptions<T extends ObjectLiteral> {
  /** 查找的实体类 */
  entityClass: EntityTarget<T>
  /** 是否加锁 */
  isLock?: boolean
  /** 实体管理对象 */
  entityManager: EntityManager
  /** 查询条件 */
  where: FindOptionsWhere<T>
  /** 验证逻辑 */
  validate: (res: T | null) => Promise<void>
}

/** 业务模板抽象类接口 */
export interface IBusinessTemplate {
  /** 应用模板的类名 */
  className: string

  /**
   * 事务模板
   * @param transactionTemplateOptions 事务模板参数
   */
  transactionTemplate: <T, R>(transactionTemplateOptions: ITransactionTemplateOptions<T, R>) => Promise<T>

  /**
   * 事务模板策略执行
   * @param strategy 策略
   */
  executionTransactionTemplateStrategy: <T, R>(strategy: ITransactionTemplateStrategy<T, R>) => Promise<T>

  /**
   * 查找单个模板
   * @param findOneTemplateOptions 查找单个模板参数
   */
  findOneTemplate: <T extends ObjectLiteral>(findOneTemplateOptions: IFindOneTemplateOptions<T>) => Promise<T | null>
}
