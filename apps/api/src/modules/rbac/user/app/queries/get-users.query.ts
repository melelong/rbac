import type { FindAllUserVO } from '../vo'
import type { FindAllDTO } from '@/common/dto'
import { Query } from '@nestjs/cqrs'

/** 获取用户列表Query */
export class GetUsersQuery extends Query<FindAllUserVO> {
  constructor(public readonly findAllDTO: FindAllDTO) {
    super()
  }
}
