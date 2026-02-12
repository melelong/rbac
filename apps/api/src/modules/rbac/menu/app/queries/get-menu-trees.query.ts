import type { TTreeNodeVO } from '@packages/types'
import type { MenuDetailsVO } from '../vo'
import type { GetTreesDTO } from '@/common/dto'
import { Query } from '@nestjs/cqrs'

/** 获取多个菜单树节点Query */
export class GetMenuTreesQuery extends Query<TTreeNodeVO<MenuDetailsVO>[]> {
  constructor(public readonly getTreesDTO: GetTreesDTO) {
    super()
  }
}
