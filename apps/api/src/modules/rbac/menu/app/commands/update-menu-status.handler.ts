import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { LoggingService, REQ_CTX } from '@/common/infra'
import { MenuDomainService } from '../../domain'
import { UpdateMenuStatusCommand } from './update-menu-status.command'

/** 更新菜单状态Handler */
@CommandHandler(UpdateMenuStatusCommand)
export class UpdateMenuStatusHandler implements ICommandHandler<UpdateMenuStatusCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly menuDomainService: MenuDomainService,
    private readonly loggingService: LoggingService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: UpdateMenuStatusCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.menuDomainService.updateMenusStatus(em, [command.id], [command.updateStatusDTO], by)
      return []
    })
  }
}
