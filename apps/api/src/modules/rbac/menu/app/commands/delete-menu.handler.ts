import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { MenuDomainService } from '../../domain'
import { DeleteMenuCommand } from './delete-menu.command'

/** 删除菜单Handler */
@CommandHandler(DeleteMenuCommand)
export class DeleteMenuHandler implements ICommandHandler<DeleteMenuCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly menuDomainService: MenuDomainService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: DeleteMenuCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await Promise.all([this.menuDomainService.deleteMenus(em, [command.id], by)])
      return []
    })
  }
}
