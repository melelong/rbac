import type { IUserRoleRepository } from '../../domain'
import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra'
import { ManyToManyRepositoryTemplate } from '@/common/template'
import { USER_ROLE_TABLE } from '../../domain'

/** 用户角色仓库实现 */
@Injectable()
@LogContextClass()
export class UserRoleRepository extends ManyToManyRepositoryTemplate implements IUserRoleRepository {
  constructor(
    protected readonly em: EntityManager,
    protected readonly loggingService: LoggingService,
  ) {
    super(USER_ROLE_TABLE, em, loggingService)
  }
}
