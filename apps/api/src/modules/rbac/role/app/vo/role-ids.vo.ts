import type { IRoleIdsVO } from '@packages/types'
import type { RoleEntity } from '../../domain'

/** 角色ID列表VO */
export class RoleIdsVO implements IRoleIdsVO {
  /**
   * 角色ID列表
   * @example []
   */
  ids: string[]
  constructor(roles?: RoleEntity[]) {
    if (roles) this.ids = roles.map((item) => item.id)
  }
}
