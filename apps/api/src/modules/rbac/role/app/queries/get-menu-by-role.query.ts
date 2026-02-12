import type { MenuIdsVO } from '@/modules/rbac/menu/app'
import type { RoleIdDTO } from '@/modules/rbac/role/app'
import { Query } from '@nestjs/cqrs'

/** 获取角色的菜单ID列表Query */
export class GetMenuByRoleQuery extends Query<MenuIdsVO> {
  constructor(public readonly id: RoleIdDTO['id']) {
    super()
  }
}
