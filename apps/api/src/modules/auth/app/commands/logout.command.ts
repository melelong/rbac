import type { Response } from 'express'
import { Command } from '@nestjs/cqrs'

/** 登出Command */
export class LogoutCommand extends Command<never[]> {
  constructor(public readonly res: Response) {
    super()
  }
}
