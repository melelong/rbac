import type { FindOptionsRelations, FindOptionsWhere } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { EntityManager, Like } from 'typeorm'
import { LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra'
import { CrudRepositoryTemplate } from '@/common/template'
import { IMenuRepository, MenuEntity } from '../../domain'

/** 菜单仓库实现 */
@Injectable()
@LogContextClass()
export class MenuRepository extends CrudRepositoryTemplate<MenuEntity> implements IMenuRepository {
  constructor(
    protected readonly em: EntityManager,
    protected readonly loggingService: LoggingService,
  ) {
    super(MenuEntity, em, loggingService)
  }

  buildKeywordWhere(keyword: string): FindOptionsWhere<MenuEntity>[] {
    return [
      { name: Like(`%${keyword}%`) },
      { menuCode: Like(`%${keyword}%`) },
      { domain: Like(`%${keyword}%`) },
      { action: Like(`%${keyword}%`) },
      { path: Like(`%${keyword}%`) },
      { query: Like(`%${keyword}%`) },
      { component: Like(`%${keyword}%`) },
      { icon: Like(`%${keyword}%`) },
    ]
  }

  getDefaultRelations(): FindOptionsRelations<MenuEntity> {
    return {
      ancestorNodes: true,
      descendantNodes: true,
    }
  }
}
