import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { MenuDomainService } from '../../domain'
import { MenuVOAssembler } from '../assemblers'
import { GetMenusQuery } from './get-menus.query'

/** 获取菜单列表Handler */
@QueryHandler(GetMenusQuery)
export class GetMenusHandler implements IQueryHandler<GetMenusQuery> {
  constructor(private readonly menuDomainService: MenuDomainService) {}
  async execute(query: GetMenusQuery) {
    const { limit = 10, page = 1 } = query.findAllDTO
    const [data, total] = await this.menuDomainService.getMenus(query.findAllDTO)
    return MenuVOAssembler.toFindAllVO({ data, limit, page, total })
  }
}
