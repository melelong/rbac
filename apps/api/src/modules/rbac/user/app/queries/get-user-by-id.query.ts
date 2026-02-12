import type { UserIdDTO } from '../dto'
import type { UserDetailsVO } from '../vo'
import { Query } from '@nestjs/cqrs'

/** 获取用户详情Query */
export class GetUserByIdQuery extends Query<UserDetailsVO> {
  constructor(public readonly id: UserIdDTO['id']) {
    super()
  }
}
