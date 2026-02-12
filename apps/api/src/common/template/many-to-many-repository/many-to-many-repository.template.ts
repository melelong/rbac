import type { IManyToManyRepositoryTemplate } from './IManyToManyRepositoryTemplate'
import type { LoggingService } from '@/common/infra'
import { EntityManager } from 'typeorm'
import { LogContextMethod } from '@/common/deco'

/**
 * 多对多中间表仓库抽象模板类
 */
export abstract class ManyToManyRepositoryTemplate implements IManyToManyRepositoryTemplate {
  constructor(
    protected readonly tableName: string,
    protected readonly entityManager: EntityManager,
    protected readonly loggingService: LoggingService,
  ) {}

  @LogContextMethod()
  async deleteMany(ids: string[], columnKey: string, em?: EntityManager) {
    this.loggingService.debug('run')
    if (ids.length <= 0) return true
    const _this = em || this.entityManager
    const sql = _this.createQueryBuilder().delete().from(this.tableName)
    ids.length === 1 ? sql.where(`${columnKey} = :id`, { id: ids[0] }) : sql.where(`${columnKey} IN (:...ids)`, { ids })
    await sql.execute()
    return true
  }
}
