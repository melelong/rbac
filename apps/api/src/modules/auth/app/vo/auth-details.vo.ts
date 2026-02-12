import type { IAuthDetailsVO } from '@packages/types'
import type { AuthEntity } from '../../domain'
import { ApiSchema } from '@nestjs/swagger'
import { omit } from 'lodash-es'
import { BaseVO } from '@/common/vo'

/** 认证详情 */
@ApiSchema({ description: '认证详情' })
export class AuthDetailsVO extends BaseVO implements IAuthDetailsVO {
  /**
   * 认证名
   * @example '认证名'
   */
  name: string
  /**
   * 认证ID
   * @example 'xxx'
   */
  id: string
  constructor(auth?: AuthEntity) {
    super()
    if (auth) {
      const keys = ['_id']
      const omitResult = omit(auth, keys)
      Object.assign(this, omitResult)
    }
  }
}
