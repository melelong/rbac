import type { FindOneOptions, FindOptionsRelations, FindOptionsWhere } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { EntityManager, In } from 'typeorm'
import { LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra'
import { CrudRepositoryTemplate } from '@/common/template'
import { IRoleRepository, RoleEntity } from '../../domain'

/** 角色仓库实现 */
@Injectable()
@LogContextClass()
export class RoleRepository extends CrudRepositoryTemplate<RoleEntity> implements IRoleRepository {
  constructor(
    protected readonly em: EntityManager,
    protected readonly loggingService: LoggingService,
  ) {
    super(RoleEntity, em, loggingService)
  }

  getDefaultRelations(): FindOptionsRelations<RoleEntity> {
    return {
      ancestorNodes: true,
      descendantNodes: true,
    }
  }

  async findManyByCode(roleCodeList: string[], relations?: boolean, em?: EntityManager) {
    this.loggingService.debug('run')
    if (roleCodeList.length <= 0) return []
    const where: FindOptionsWhere<RoleEntity> = { roleCode: roleCodeList.length === 1 ? roleCodeList[0] : In(roleCodeList) }
    const options: FindOneOptions<RoleEntity> = { where, relations: relations ? this.getDefaultRelations() : undefined }
    return em ? await em.find(RoleEntity, { ...options, lock: { mode: 'pessimistic_write' } }) : await this.find(options)
  }

  async existsByCode(roleCodeList: string[], em?: EntityManager) {
    this.loggingService.debug('run')
    if (roleCodeList.length <= 0) return false
    const where: FindOptionsWhere<RoleEntity> = { roleCode: roleCodeList.length === 1 ? roleCodeList[0] : In(roleCodeList) }
    return em ? await em.existsBy(RoleEntity, where) : await this.existsBy(where)
  }
}
