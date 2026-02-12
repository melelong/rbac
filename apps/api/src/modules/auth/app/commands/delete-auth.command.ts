import type { AuthIdDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 删除认证Command */
export class DeleteAuthCommand extends Command<never[]> {
  constructor(public readonly id: AuthIdDTO['id']) {
    super()
  }
}
