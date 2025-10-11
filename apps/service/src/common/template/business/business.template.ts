import type { EntityManager, ObjectLiteral } from 'typeorm'
import type {
  IBusinessTemplate,
  IBusinessTemplateOptions,
  IFindOneTemplateOptions,
  ITransactionTemplateOptions,
  ITransactionTemplateStrategy,
} from './IBusinessTemplate'
import type { Cache2Service } from '@/infrastructure/cache2/cache2.service'

export abstract class BusinessTemplate implements IBusinessTemplate {
  className: string
  /** 缓存服务 */
  abstract readonly cacheService?: Cache2Service
  /** 实体管理对象 */
  abstract readonly entityManager: EntityManager
  constructor(businessTemplateOptions: IBusinessTemplateOptions) {
    const { className } = businessTemplateOptions
    this.className = className
  }

  async transactionTemplate<T, R>(transactionTemplateOptions: ITransactionTemplateOptions<T, R>): Promise<T> {
    const { validate, handler } = transactionTemplateOptions
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      let validateValue: R | undefined | void
      // 验证逻辑
      if (validate) validateValue = await validate(entityManager)
      // 业务逻辑
      return handler(entityManager, validateValue)
    })
  }

  async executionTransactionTemplateStrategy<T, R>(strategy: ITransactionTemplateStrategy<T, R>) {
    return this.transactionTemplate<T, R>({
      validate: strategy.validate?.bind(strategy),
      handler: strategy.handler.bind(strategy),
    })
  }

  async findOneTemplate<T extends ObjectLiteral>(findOneTemplateOptions: IFindOneTemplateOptions<T>) {
    const { entityManager, isLock, entityClass, where, validate } = findOneTemplateOptions
    const res = await entityManager.findOne(entityClass, { where, lock: isLock ? { mode: 'pessimistic_write' } : undefined })
    // 验证逻辑
    if (validate) await validate(res)
    return res
  }
}
