import type { ResourceIdDTO } from '../dto'
import type { UpdateStatusDTO } from '@/common/dto'
import { Command } from '@nestjs/cqrs'

/** 更新资源状态Command */
export class UpdateResourceStatusCommand extends Command<never[]> {
  constructor(
    public readonly id: ResourceIdDTO['id'],
    public readonly updateStatusDTO: UpdateStatusDTO,
  ) {
    super()
  }
}
