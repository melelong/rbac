import type { TTreeNodeVO } from '@packages/types'
import type { RoleEntity } from '../../domain'
import { ApiSchema } from '@nestjs/swagger'
import { RoleDetailsVO } from './role-details.vo'

/** 角色树节点 */
@ApiSchema({ description: '角色树节点' })
export class RoleTreeVO extends RoleDetailsVO implements TTreeNodeVO<RoleDetailsVO> {
  /**
   * 角色子节点列表
   * @example []
   */
  children: RoleTreeVO[]
  constructor(role?: RoleEntity) {
    super(role)
    this.children = []
  }
}
