import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { LoggingService, REQ_CTX } from '@/common/infra'
import { MenuDomainService } from '../../domain'
import { UpdateMenuSortCommand } from './update-menu-sort.command'

/** 更新菜单排序Handler */
@CommandHandler(UpdateMenuSortCommand)
export class UpdateMenuSortHandler implements ICommandHandler<UpdateMenuSortCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly menuDomainService: MenuDomainService,
    private readonly loggingService: LoggingService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: UpdateMenuSortCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.menuDomainService.updateMenusSort(em, [command.id], [command.updateSortDTO], by)
      return []
    })
  }
}
