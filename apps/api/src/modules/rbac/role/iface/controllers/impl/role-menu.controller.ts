import type { IRoleMenuController } from '../IRoleMenuController'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiExtraModels } from '@nestjs/swagger'
import { ResourceTypeEnum } from '@packages/types'
import { ApiController, ApiMethod, ResourceDomain, ResourceMethod, ResourceType } from '@/common/deco'
import { ResVO } from '@/common/vo'
import { MenuIdDTO, MenuIdsVO } from '@/modules/rbac/menu/app'
import {
  AssignRoleMenuCommand,
  AssignRoleMenuDTO,
  AssignRolesMenuCommand,
  AssignRolesMenuDTO,
  GetMenuByRoleQuery,
  GetRoleByMenuQuery,
  RoleIdDTO,
  RoleIdsVO,
} from '../../../app'

/** 角色菜单控制器实现 */
@Controller('role/menu')
@ResourceType(ResourceTypeEnum.API)
@ResourceDomain('ROLE_MENU')
@ApiController({ ApiTagsOptions: ['RoleMenu'] })
@ApiExtraModels(MenuIdsVO, RoleIdsVO)
export class RoleMenuController implements IRoleMenuController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @ResourceMethod('assign')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '给角色分配菜单' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async assign(@Body() assignRoleMenuDTO: AssignRoleMenuDTO) {
    return await this.commandBus.execute(new AssignRoleMenuCommand(assignRoleMenuDTO))
  }

  @Post('batch')
  @ResourceMethod('batchAssign')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '批量给角色分配菜单' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async batchAssign(@Body() assignRolesMenuDTO: AssignRolesMenuDTO) {
    return await this.commandBus.execute(new AssignRolesMenuCommand(assignRolesMenuDTO))
  }

  @Get(':id/menu-ids')
  @ResourceMethod('menuIds')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '获取角色的菜单ID列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(MenuIdsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async menuIds(@Param() roleIdDTO: RoleIdDTO) {
    return this.queryBus.execute(new GetMenuByRoleQuery(roleIdDTO.id))
  }

  @Get(':id/role-ids')
  @ResourceMethod('roleIds')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '获取菜单的角色ID列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(RoleIdsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async roleIds(@Param() menuIdDTO: MenuIdDTO) {
    return this.queryBus.execute(new GetRoleByMenuQuery(menuIdDTO.id))
  }
}
