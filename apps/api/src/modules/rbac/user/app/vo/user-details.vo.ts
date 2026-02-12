import type { IUserDetailsVO } from '@packages/types'
import type { UserEntity } from '../../domain'
import { ApiSchema } from '@nestjs/swagger'
import { omit } from 'lodash-es'
import { BaseVO } from '@/common/vo'
import { UserProfileVO } from './user-profile.vo'

/** 用户详情 */
@ApiSchema({ description: '用户详情' })
export class UserDetailsVO extends BaseVO implements IUserDetailsVO {
  /**
   * 用户名
   * @example '用户名'
   */
  name: string
  /**
   * 用户档案
   */
  profile: UserProfileVO
  /**
   * 用户ID
   * @example 'xxx'
   */
  id: string
  constructor(user?: UserEntity) {
    super()
    if (user) {
      const keys = ['_id', 'pwd', 'loginIp', 'salt', 'roles']
      const omitResult = omit(user, keys)
      Object.assign(this, omitResult)
      this.profile = new UserProfileVO(user.profile)
    }
  }
}
