import type { FindAllAuthVO } from '../vo'
import type { FindAllDTO } from '@/common/dto'
import { Query } from '@nestjs/cqrs'

/** 获取认证列表Query */
export class GetAuthsQuery extends Query<FindAllAuthVO> {
  constructor(public readonly findAllDTO: FindAllDTO) {
    super()
  }
}
