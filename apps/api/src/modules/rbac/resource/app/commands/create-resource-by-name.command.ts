import type { CreateResourceDTO } from '../dto'
import type { ResourceDetailsVO } from '../vo'
import { Command } from '@nestjs/cqrs'

/** 通过名字创建资源Command */
export class CreateResourceByNameCommand extends Command<ResourceDetailsVO> {
  constructor(public readonly createResourceDTO: CreateResourceDTO) {
    super()
  }
}
