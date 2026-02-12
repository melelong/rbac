import type { IRoleResourceRepository } from '../../domain'
import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra'
import { ManyToManyRepositoryTemplate } from '@/common/template'
import { ROLE_RESOURCE_TABLE } from '../../domain'

/** 角色资源仓库实现 */
@Injectable()
@LogContextClass()
export class RoleResourceRepository extends ManyToManyRepositoryTemplate implements IRoleResourceRepository {
  constructor(
    protected readonly em: EntityManager,
    protected readonly loggingService: LoggingService,
  ) {
    super(ROLE_RESOURCE_TABLE, em, loggingService)
  }
}
