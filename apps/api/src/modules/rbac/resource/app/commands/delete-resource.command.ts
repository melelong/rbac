import type { ResourceIdDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 删除资源Command */
export class DeleteResourceCommand extends Command<never[]> {
  constructor(public readonly id: ResourceIdDTO['id']) {
    super()
  }
}
