import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { MenuDomainService } from '../../domain'
import { MenuVOAssembler } from '../assemblers'
import { MoveMenuCommand } from './move-menu.command'
import { REQ_CTX } from '@/common/infra'

/** 移动菜单树节点Handler */
@CommandHandler(MoveMenuCommand)
export class MoveMenuHandler implements ICommandHandler<MoveMenuCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly menuDomainService: MenuDomainService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: MoveMenuCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const { parentId } = command.moveMenuDTO
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      const [menu] = await this.menuDomainService.moveMenus(em, [command.id], [parentId ?? null], by)
      return MenuVOAssembler.toDetailsVO(menu)
    })
  }
}
