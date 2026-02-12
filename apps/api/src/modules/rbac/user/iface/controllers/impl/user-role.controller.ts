import type { IUserRoleController } from '../IUserRoleController'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiExtraModels } from '@nestjs/swagger'
import { ResourceTypeEnum } from '@packages/types'
import { ApiController, ApiMethod, ResourceDomain, ResourceMethod, ResourceType } from '@/common/deco'
import { ResVO } from '@/common/vo'
import { RoleIdDTO, RoleIdsVO } from '@/modules/rbac/role/app'
import {
  AssignUserRoleCommand,
  AssignUserRoleDTO,
  AssignUsersRoleCommand,
  AssignUsersRoleDTO,
  GetRoleByUserQuery,
  GetUserByRoleQuery,
  UserIdDTO,
  UserIdsVO,
} from '../../../app'

/** 用户角色控制器实现 */
@Controller('user/role')
@ResourceType(ResourceTypeEnum.API)
@ResourceDomain('USER_ROLE')
@ApiController({ ApiTagsOptions: ['UserRole'] })
@ApiExtraModels(RoleIdsVO, UserIdsVO)
export class UserRoleController implements IUserRoleController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @ResourceMethod('assign')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '给用户分配角色' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async assign(@Body() assignUserRoleDTO: AssignUserRoleDTO) {
    return await this.commandBus.execute(new AssignUserRoleCommand(assignUserRoleDTO))
  }

  @Post('batch')
  @ResourceMethod('batchAssign')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '批量给用户分配角色' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async batchAssign(@Body() assignUsersRoleDTO: AssignUsersRoleDTO) {
    return await this.commandBus.execute(new AssignUsersRoleCommand(assignUsersRoleDTO))
  }

  @Get(':id/role-ids')
  @ResourceMethod('roleIds')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '获取用户的角色ID列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(RoleIdsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async roleIds(@Param() userIdDTO: UserIdDTO) {
    return this.queryBus.execute(new GetRoleByUserQuery(userIdDTO.id))
  }

  @Get(':id/user-ids')
  @ResourceMethod('userIds')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '获取角色的用户ID列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(UserIdsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async userIds(@Param() roleIdDTO: RoleIdDTO) {
    return this.queryBus.execute(new GetUserByRoleQuery(roleIdDTO.id))
  }
}
