import type { IUserDetailsVO } from '@packages/types'
import { Query } from '@nestjs/cqrs'

/** 获取当前登录用户信息Query */
export class GetMeInfoQuery extends Query<IUserDetailsVO> {
  constructor() {
    super()
  }
}
