import type { AuthIdDTO } from '../dto'
import type { AuthDetailsVO } from '../vo'
import { Query } from '@nestjs/cqrs'

/** 获取认证详情Query */
export class GetAuthByIdQuery extends Query<AuthDetailsVO> {
  constructor(public readonly id: AuthIdDTO['id']) {
    super()
  }
}
