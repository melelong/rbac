import type { RoleIdDTO } from '../dto'
import type { ResourceIdsVO } from '@/modules/rbac/resource/app'
import { Query } from '@nestjs/cqrs'

/** 获取角色的资源ID列表Query */
export class GetResourceByRoleQuery extends Query<ResourceIdsVO> {
  constructor(public readonly id: RoleIdDTO['id']) {
    super()
  }
}
