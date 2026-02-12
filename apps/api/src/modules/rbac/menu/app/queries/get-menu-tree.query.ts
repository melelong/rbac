import type { TTreeNodeVO } from '@packages/types'
import type { MenuIdDTO } from '../dto'
import type { MenuDetailsVO } from '../vo'
import type { GetTreeDepthDTO } from '@/common/dto'
import { Query } from '@nestjs/cqrs'

/** 获取单个菜单树节点Query */
export class GetMenuTreeQuery extends Query<TTreeNodeVO<MenuDetailsVO>> {
  constructor(
    public readonly id: MenuIdDTO['id'],
    public readonly getTreeDepthDTO: GetTreeDepthDTO,
  ) {
    super()
  }
}
