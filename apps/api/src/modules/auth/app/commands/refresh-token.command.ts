import type { ITokenVO } from '@packages/types'
import type { Response } from 'express'
import { Command } from '@nestjs/cqrs'

/** 刷新令牌Command */
export class RefreshTokenCommand extends Command<ITokenVO> {
  constructor(public readonly res: Response) {
    super()
  }
}
