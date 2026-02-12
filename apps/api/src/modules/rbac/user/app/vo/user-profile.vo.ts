import type { UserProfileEntity } from '../../domain'
import { ApiSchema } from '@nestjs/swagger'
import { IUserProfileVO, SexEnum } from '@packages/types'
import { omit } from 'lodash-es'

/** 用户档案 */
@ApiSchema({ description: '用户档案' })
export class UserProfileVO implements IUserProfileVO {
  /**
   * 昵称
   * @example '张三'
   */
  nickName: string
  /**
   * 性别(未知:10 男:20 女:30)
   * @example 10
   */
  sex: SexEnum
  /**
   * 出生日期
   * @example '2000-01-01'
   */
  birthday: Date | null
  /**
   * 邮箱
   * @example 'zhangsan@example.com'
   */
  email: string | null
  /**
   * 电话号码
   * @example '13800000000'
   */
  phone: string | null
  /**
   * 头像地址
   * @example 'https://cn.cravatar.com/avatar'
   */
  avatar: string
  constructor(userProfile?: UserProfileEntity) {
    if (userProfile) {
      const keys = ['id', '_id', 'user', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deletedBy', 'deletedAt', 'status', 'sort']
      const omitResult = omit(userProfile, keys)
      Object.assign(this, omitResult)
    }
  }
}
