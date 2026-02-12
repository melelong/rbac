import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { MenuDomainService } from '../../domain'
import { MenuTreeVO } from '../vo'
import { GetMenuTreesQuery } from './get-menu-trees.query'

/** 获取多个菜单树节点Handler */
@QueryHandler(GetMenuTreesQuery)
export class GetMenuTreesHandler implements IQueryHandler<GetMenuTreesQuery> {
  constructor(private readonly menuDomainService: MenuDomainService) {}
  async execute(query: GetMenuTreesQuery) {
    const { ids, depth = -1 } = query.getTreesDTO
    const menuTrees = await this.menuDomainService.getMenuTreesByIds(ids, MenuTreeVO, depth)
    return menuTrees
  }
}
