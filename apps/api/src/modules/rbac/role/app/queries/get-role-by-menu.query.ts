import type { RoleIdsVO } from '../vo'
import type { MenuIdDTO } from '@/modules/rbac/menu/app'
import { Query } from '@nestjs/cqrs'

/** 获取菜单的角色ID列表Query */
export class GetRoleByMenuQuery extends Query<RoleIdsVO> {
  constructor(public readonly id: MenuIdDTO['id']) {
    super()
  }
}
