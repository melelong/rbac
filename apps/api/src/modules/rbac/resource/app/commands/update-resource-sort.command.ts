import type { ResourceIdDTO } from '../dto'
import type { UpdateSortDTO } from '@/common/dto'
import { Command } from '@nestjs/cqrs'

/** 更新资源排序Command */
export class UpdateResourceSortCommand extends Command<never[]> {
  constructor(
    public readonly id: ResourceIdDTO['id'],
    public readonly updateSortDTO: UpdateSortDTO,
  ) {
    super()
  }
}
