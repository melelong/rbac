import type { IRoleMenuRepository } from '../../domain'
import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra'
import { ManyToManyRepositoryTemplate } from '@/common/template'
import { ROLE_MENU_TABLE } from '../../domain'

/** 角色菜单仓库实现 */
@Injectable()
@LogContextClass()
export class RoleMenuRepository extends ManyToManyRepositoryTemplate implements IRoleMenuRepository {
  constructor(
    protected readonly em: EntityManager,
    protected readonly loggingService: LoggingService,
  ) {
    super(ROLE_MENU_TABLE, em, loggingService)
  }
}
