import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { MenuDomainService } from '../../domain'
import { MenuVOAssembler } from '../assemblers'
import { CreateMenuByNameCommand } from './create-menu-by-name.command'

/** 通过名字创建菜单Handler */
@CommandHandler(CreateMenuByNameCommand)
export class CreateMenuByNameHandler implements ICommandHandler<CreateMenuByNameCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly menuDomainService: MenuDomainService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: CreateMenuByNameCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      const [menu] = await this.menuDomainService.createMenus(em, [command.createMenuDTO], by)
      return MenuVOAssembler.toDetailsVO(menu)
    })
  }
}
