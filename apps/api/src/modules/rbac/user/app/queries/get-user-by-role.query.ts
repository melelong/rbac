import type { UserIdsVO } from '../vo'
import type { RoleIdDTO } from '@/modules/rbac/role/app'
import { Query } from '@nestjs/cqrs'

/** 获取角色的用户ID列表Query */
export class GetUserByRoleQuery extends Query<UserIdsVO> {
  constructor(public readonly id: RoleIdDTO['id']) {
    super()
  }
}
