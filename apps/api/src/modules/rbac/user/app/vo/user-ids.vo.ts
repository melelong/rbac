import type { IUserIdsVO } from '@packages/types'
import type { UserEntity } from '../../domain'

/** 用户ID列表VO */
export class UserIdsVO implements IUserIdsVO {
  /**
   * 用户ID列表
   * @example []
   */
  ids: string[]
  constructor(users?: UserEntity[]) {
    if (users) this.ids = users.map((item) => item.id)
  }
}
