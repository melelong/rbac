import type { CreateUserDTO } from '../dto'
import type { UserDetailsVO } from '../vo'
import { Command } from '@nestjs/cqrs'

/** 创建用户Command */
export class CreateUserByNameCommand extends Command<UserDetailsVO> {
  constructor(public readonly createUserDTO: CreateUserDTO) {
    super()
  }
}
