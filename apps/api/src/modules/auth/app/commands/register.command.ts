import type { CreateUserDTO } from '@/modules/rbac/user/app'
import { Command } from '@nestjs/cqrs'

/** 注册Command */
export class RegisterCommand extends Command<never[]> {
  constructor(public readonly createUserDTO: CreateUserDTO) {
    super()
  }
}
