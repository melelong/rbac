import type { ResourceIdDTO } from '../dto'
import type { ResourceDetailsVO } from '../vo'
import { Query } from '@nestjs/cqrs'

/** 获取资源详情Query */
export class GetResourceByIdQuery extends Query<ResourceDetailsVO> {
  constructor(public readonly id: ResourceIdDTO['id']) {
    super()
  }
}
