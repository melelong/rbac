import type { TTreeNodeVO } from '@packages/types'
import type { RoleDetailsVO } from '../vo'
import type { GetTreesDTO } from '@/common/dto'
import { Query } from '@nestjs/cqrs'

/** 获取多个角色树节点Query */
export class GetRoleTreesQuery extends Query<TTreeNodeVO<RoleDetailsVO>[]> {
  constructor(public readonly getTreesDTO: GetTreesDTO) {
    super()
  }
}
