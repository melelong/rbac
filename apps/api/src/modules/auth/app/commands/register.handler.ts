import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { AuthUserService } from '../services'
import { RegisterCommand } from './register.command'

/** 注册Handler */
@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly authUserService: AuthUserService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: RegisterCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      const { createUserDTO } = command
      await this.authUserService.register(em, [createUserDTO], by)
      return []
    })
  }
}
