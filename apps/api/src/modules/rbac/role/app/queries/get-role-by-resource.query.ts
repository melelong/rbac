import type { RoleIdsVO } from '../vo'
import type { ResourceIdDTO } from '@/modules/rbac/resource/app'
import { Query } from '@nestjs/cqrs'

/** 获取资源的角色ID列表Query */
export class GetRoleByResourceQuery extends Query<RoleIdsVO> {
  constructor(public readonly id: ResourceIdDTO['id']) {
    super()
  }
}
