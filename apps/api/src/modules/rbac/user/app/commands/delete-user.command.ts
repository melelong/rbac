import type { UserIdDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 删除用户Command */
export class DeleteUserCommand extends Command<never[]> {
  constructor(public readonly id: UserIdDTO['id']) {
    super()
  }
}
