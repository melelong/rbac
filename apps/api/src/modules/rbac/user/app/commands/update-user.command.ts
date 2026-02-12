import type { UpdateUserDTO, UserIdDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 更新用户Command */
export class UpdateUserCommand extends Command<never[]> {
  constructor(
    public readonly id: UserIdDTO['id'],
    public readonly updateUserDTO: UpdateUserDTO,
  ) {
    super()
  }
}
