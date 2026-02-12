import type { Response } from 'express'
import type { TokenVO } from '../vo'
import { Command } from '@nestjs/cqrs'

/** 登录Command */
export class LoginCommand extends Command<TokenVO> {
  constructor(public readonly res: Response) {
    super()
  }
}
