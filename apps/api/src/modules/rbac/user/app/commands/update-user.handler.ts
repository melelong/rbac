import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { LoggingService, REQ_CTX } from '@/common/infra'
import { UserDomainService } from '../../domain'
import { UpdateUserCommand } from './update-user.command'

/** 更新用户Handler */
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly userDomainService: UserDomainService,
    private readonly loggingService: LoggingService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: UpdateUserCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.userDomainService.updateUsers(em, [command.id], [command.updateUserDTO], by)
      return []
    })
  }
}
