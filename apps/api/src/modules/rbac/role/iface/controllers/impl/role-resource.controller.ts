import type { IRoleResourceController } from '../IRoleResourceController'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiExtraModels } from '@nestjs/swagger'
import { ResourceTypeEnum } from '@packages/types'
import { ApiController, ApiMethod, ResourceDomain, ResourceMethod, ResourceType } from '@/common/deco'
import { ResVO } from '@/common/vo'
import { ResourceIdDTO, ResourceIdsVO } from '@/modules/rbac/resource/app'
import {
  AssignRoleResourceCommand,
  AssignRoleResourceDTO,
  AssignRolesResourceCommand,
  AssignRolesResourceDTO,
  GetResourceByRoleQuery,
  GetRoleByResourceQuery,
  RoleIdDTO,
  RoleIdsVO,
} from '../../../app'

/** 角色资源控制器实现 */
@Controller('role/resource')
@ResourceType(ResourceTypeEnum.API)
@ResourceDomain('ROLE_RESOURCE')
@ApiController({ ApiTagsOptions: ['RoleResource'] })
@ApiExtraModels(ResourceIdsVO, RoleIdsVO)
export class RoleResourceController implements IRoleResourceController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @ResourceMethod('assign')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '给角色分配资源' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async assign(@Body() assignRoleResourceDTO: AssignRoleResourceDTO) {
    return await this.commandBus.execute(new AssignRoleResourceCommand(assignRoleResourceDTO))
  }

  @Post('batch')
  @ResourceMethod('batchAssign')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '批量给角色分配资源' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async batchAssign(@Body() assignRolesResourceDTO: AssignRolesResourceDTO) {
    return await this.commandBus.execute(new AssignRolesResourceCommand(assignRolesResourceDTO))
  }

  @Get(':id/resource-ids')
  @ResourceMethod('resourceIds')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '获取角色的资源ID列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(ResourceIdsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async resourceIds(@Param() roleIdDTO: RoleIdDTO) {
    return this.queryBus.execute(new GetResourceByRoleQuery(roleIdDTO.id))
  }

  @Get(':id/role-ids')
  @ResourceMethod('roleIds')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '获取资源的角色ID列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(RoleIdsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async roleIds(@Param() resourceIdDTO: ResourceIdDTO) {
    return this.queryBus.execute(new GetRoleByResourceQuery(resourceIdDTO.id))
  }
}
