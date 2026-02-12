import type { AuthIdDTO, UpdateAuthDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 更新认证Command */
export class UpdateAuthCommand extends Command<never[]> {
  constructor(
    public readonly id: AuthIdDTO['id'],
    public readonly updateAuthDTO: UpdateAuthDTO,
  ) {
    super()
  }
}
