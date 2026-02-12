import type { FindAllResourceVO } from '../vo'
import type { FindAllDTO } from '@/common/dto'
import { Query } from '@nestjs/cqrs'

/** 获取资源列表Query */
export class GetResourcesQuery extends Query<FindAllResourceVO> {
  constructor(public readonly findAllDTO: FindAllDTO) {
    super()
  }
}
