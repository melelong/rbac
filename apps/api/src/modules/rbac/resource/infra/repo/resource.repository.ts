import type { FindOneOptions, FindOptionsWhere } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { EntityManager, In } from 'typeorm'
import { LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra'
import { CrudRepositoryTemplate } from '@/common/template'
import { IResourceRepository, ResourceEntity } from '../../domain'

/** 资源仓库实现 */
@Injectable()
@LogContextClass()
export class ResourceRepository extends CrudRepositoryTemplate<ResourceEntity> implements IResourceRepository {
  constructor(
    protected readonly em: EntityManager,
    protected readonly loggingService: LoggingService,
  ) {
    super(ResourceEntity, em, loggingService)
  }

  async findManyByCode(resourceCodeList: string[], relations?: boolean, em?: EntityManager) {
    this.loggingService.debug('run')
    if (resourceCodeList.length <= 0) return []
    const where: FindOptionsWhere<ResourceEntity> = {
      resourceCode: resourceCodeList.length === 1 ? resourceCodeList[0] : In(resourceCodeList),
    }
    const options: FindOneOptions<ResourceEntity> = { where, relations: relations ? this.getDefaultRelations() : undefined }
    return em ? await em.find(ResourceEntity, { ...options, lock: { mode: 'pessimistic_write' } }) : await this.find(options)
  }

  async existsByCode(resourceCodeList: string[], em?: EntityManager) {
    this.loggingService.debug('run')
    if (resourceCodeList.length <= 0) return false
    const where: FindOptionsWhere<ResourceEntity> = {
      resourceCode: resourceCodeList.length === 1 ? resourceCodeList[0] : In(resourceCodeList),
    }
    return em ? await em.existsBy(ResourceEntity, where) : await this.existsBy(where)
  }
}
