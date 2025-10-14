import type { IMenuController } from './IMenu'
import { Controller, Post } from '@nestjs/common'
import { ApiController, ApiMethod } from '@/common/decorators'
import { MenuService } from './menu.service'
import { MenuVO } from './vo'

@Controller('menu')
@ApiController({ ApiTagsOptions: ['菜单模块'] })
export class MenuController implements IMenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiMethod({
    ApiOperationOptions: [{ summary: '创建菜单' }],
    ApiResponseOptions: [{ type: MenuVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async create() {
    return await this.menuService.create()
  }
}
