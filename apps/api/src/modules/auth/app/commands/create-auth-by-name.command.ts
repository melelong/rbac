import type { CreateAuthDTO } from '../dto'
import type { AuthDetailsVO } from '../vo'
import { Command } from '@nestjs/cqrs'

/** 通过名字创建认证Command */
export class CreateAuthByNameCommand extends Command<AuthDetailsVO> {
  constructor(public readonly createAuthDTO: CreateAuthDTO) {
    super()
  }
}
