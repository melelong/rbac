import type { IRoleTreeRepository } from '../../domain'
import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra'
import { TreeRepositoryTemplate } from '@/common/template'
import { RoleTreeEntity } from '../../domain'

/** 角色树仓库实现 */
@Injectable()
@LogContextClass()
export class RoleTreeRepository extends TreeRepositoryTemplate<RoleTreeEntity> implements IRoleTreeRepository {
  constructor(
    protected readonly em: EntityManager,
    protected readonly loggingService: LoggingService,
  ) {
    super(RoleTreeEntity, em, loggingService)
  }
}
