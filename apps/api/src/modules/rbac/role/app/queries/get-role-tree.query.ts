import type { TTreeNodeVO } from '@packages/types'
import type { RoleIdDTO } from '../dto'
import type { RoleDetailsVO } from '../vo'
import type { GetTreeDepthDTO } from '@/common/dto'
import { Query } from '@nestjs/cqrs'

/** 获取单个角色树节点Query */
export class GetRoleTreeQuery extends Query<TTreeNodeVO<RoleDetailsVO>> {
  constructor(
    public readonly id: RoleIdDTO['id'],
    public readonly getTreeDepthDTO: GetTreeDepthDTO,
  ) {
    super()
  }
}
