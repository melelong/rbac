import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { MenuVOAssembler } from '@/modules/rbac/menu/app'
import { RoleMenuService } from '../services'
import { GetMenuByRoleQuery } from './get-menu-by-role.query'

/** 获取角色的菜单ID列表Handler */
@QueryHandler(GetMenuByRoleQuery)
export class GetMenuByRoleHandler implements IQueryHandler<GetMenuByRoleQuery> {
  constructor(private readonly roleMenuService: RoleMenuService) {}
  async execute(query: GetMenuByRoleQuery) {
    const [role] = await this.roleMenuService.getMenuIdsByRoleIds({ ids: [query.id] })
    return MenuVOAssembler.toIdsVO(role.menus)
  }
}
