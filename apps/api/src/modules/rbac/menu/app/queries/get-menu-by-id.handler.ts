import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { MenuDomainService } from '../../domain'
import { MenuVOAssembler } from '../assemblers'
import { GetMenuByIdQuery } from './get-menu-by-id.query'

/** 获取菜单详情Handler */
@QueryHandler(GetMenuByIdQuery)
export class GetMenuByIdHandler implements IQueryHandler<GetMenuByIdQuery> {
  constructor(private readonly menuDomainService: MenuDomainService) {}
  async execute(query: GetMenuByIdQuery) {
    const [menu] = await this.menuDomainService.getMenusByIds([query.id])
    return MenuVOAssembler.toDetailsVO(menu)
  }
}
