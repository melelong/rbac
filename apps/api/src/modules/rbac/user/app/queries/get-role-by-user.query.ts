import type { UserIdDTO } from '../dto'
import type { RoleIdsVO } from '@/modules/rbac/role/app'
import { Query } from '@nestjs/cqrs'

/** 获取用户的角色ID列表Query */
export class GetRoleByUserQuery extends Query<RoleIdsVO> {
  constructor(public readonly id: UserIdDTO['id']) {
    super()
  }
}
