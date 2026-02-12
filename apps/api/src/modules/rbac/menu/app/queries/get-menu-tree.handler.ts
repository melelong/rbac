import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { MenuDomainService } from '../../domain'
import { MenuTreeVO } from '../vo'
import { GetMenuTreeQuery } from './get-menu-tree.query'

/** 获取单个菜单树节点Handler */
@QueryHandler(GetMenuTreeQuery)
export class GetMenuTreeHandler implements IQueryHandler<GetMenuTreeQuery> {
  constructor(private readonly menuDomainService: MenuDomainService) {}
  async execute(query: GetMenuTreeQuery) {
    const {
      id,
      getTreeDepthDTO: { depth = -1 },
    } = query
    const [menuTree] = await this.menuDomainService.getMenuTreesByIds([id], MenuTreeVO, depth)
    return menuTree
  }
}
