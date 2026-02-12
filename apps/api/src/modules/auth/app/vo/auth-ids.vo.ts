import type { IAuthIdsVO } from '@packages/types'
import type { AuthEntity } from '../../domain'

/** 认证ID列表VO */
export class AuthIdsVO implements IAuthIdsVO {
  /**
   * 认证ID列表
   * @example []
   */
  ids: string[]
  constructor(auths?: AuthEntity[]) {
    if (auths) this.ids = auths.map((item) => item.id)
  }
}
