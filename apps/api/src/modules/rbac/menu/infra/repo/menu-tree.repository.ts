import type { IMenuTreeRepository } from '../../domain'
import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra'
import { TreeRepositoryTemplate } from '@/common/template'
import { MenuTreeEntity } from '../../domain'

/** 菜单树仓库实现 */
@Injectable()
@LogContextClass()
export class MenuTreeRepository extends TreeRepositoryTemplate<MenuTreeEntity> implements IMenuTreeRepository {
  constructor(
    protected readonly em: EntityManager,
    protected readonly loggingService: LoggingService,
  ) {
    super(MenuTreeEntity, em, loggingService)
  }
}
