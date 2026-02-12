import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { AuthDomainService } from '../../domain'
import { AuthVOAssembler } from '../assemblers'
import { CreateAuthByNameCommand } from './create-auth-by-name.command'

/** 通过名字创建认证Handler */
@CommandHandler(CreateAuthByNameCommand)
export class CreateAuthByNameHandler implements ICommandHandler<CreateAuthByNameCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly authDomainService: AuthDomainService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: CreateAuthByNameCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      const [auth] = await this.authDomainService.createAuths(em, [command.createAuthDTO], by)
      return AuthVOAssembler.toDetailsVO(auth)
    })
  }
}
