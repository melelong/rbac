import type { Response } from 'express'
import { Command } from '@nestjs/cqrs'

/** 重置密码Command */
export class ResetPwdCommand extends Command<never[]> {
  constructor(public readonly res: Response) {
    super()
  }
}
