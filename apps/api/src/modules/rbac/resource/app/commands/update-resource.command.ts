import type { ResourceIdDTO, UpdateResourceDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 更新资源Command */
export class UpdateResourceCommand extends Command<never[]> {
  constructor(
    public readonly id: ResourceIdDTO['id'],
    public readonly updateResourceDTO: UpdateResourceDTO,
  ) {
    super()
  }
}
