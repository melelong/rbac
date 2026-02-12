import type { RoleIdDTO } from '../dto'
import type { RoleDetailsVO } from '../vo'
import { Query } from '@nestjs/cqrs'

/** 获取角色详情Query */
export class GetRoleByIdQuery extends Query<RoleDetailsVO> {
  constructor(public readonly id: RoleIdDTO['id']) {
    super()
  }
}
