import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { RoleVOAssembler } from '@/modules/rbac/role/app'
import { RoleMenuService } from '../services'
import { GetRoleByMenuQuery } from './get-role-by-menu.query'

/** 获取菜单的角色ID列表Handler */
@QueryHandler(GetRoleByMenuQuery)
export class GetRoleByMenuHandler implements IQueryHandler<GetRoleByMenuQuery> {
  constructor(private readonly roleMenuService: RoleMenuService) {}
  async execute(query: GetRoleByMenuQuery) {
    const [menu] = await this.roleMenuService.getRoleIdsByMenuIds({ ids: [query.id] })
    return RoleVOAssembler.toIdsVO(menu.roles)
  }
}
