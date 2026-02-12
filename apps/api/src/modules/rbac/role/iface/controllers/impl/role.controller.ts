import type { IRoleController } from '../IRoleController'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiExtraModels } from '@nestjs/swagger'
import { ResourceTypeEnum } from '@packages/types'
import { ApiController, ApiMethod, ResourceDomain, ResourceMethod, ResourceType } from '@/common/deco'
import { FindAllDTO, GetTreeDepthDTO, GetTreesDTO, UpdateSortDTO, UpdateStatusDTO } from '@/common/dto'
import { ResVO } from '@/common/vo'
import {
  CreateRoleByNameCommand,
  CreateRoleDTO,
  DeleteRoleCommand,
  FindAllRoleVO,
  GetRoleByIdQuery,
  GetRolesQuery,
  GetRoleTreeQuery,
  GetRoleTreesQuery,
  MoveRoleCommand,
  MoveRoleDTO,
  RoleDetailsVO,
  RoleIdDTO,
  RoleTreeVO,
  UpdateRoleCommand,
  UpdateRoleDTO,
  UpdateRoleSortCommand,
  UpdateRoleStatusCommand,
} from '../../../app'

/** 角色控制器实现 */
@Controller('role')
@ResourceType(ResourceTypeEnum.API)
@ResourceDomain('ROLE')
@ApiController({ ApiTagsOptions: ['Role'] })
@ApiExtraModels(FindAllRoleVO, RoleDetailsVO, RoleTreeVO)
export class RoleController implements IRoleController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @ResourceMethod('create')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '创建角色' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(RoleDetailsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async create(@Body() createRoleDTO: CreateRoleDTO) {
    return await this.commandBus.execute(new CreateRoleByNameCommand(createRoleDTO))
  }

  @Delete(':id')
  @ResourceMethod('delete')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '删除角色' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async delete(@Param() roleIdDTO: RoleIdDTO) {
    return await this.commandBus.execute(new DeleteRoleCommand(roleIdDTO.id))
  }

  @Patch(':id')
  @ResourceMethod('update')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '更新角色' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async update(@Param() roleIdDTO: RoleIdDTO, @Body() updateRoleDTO: UpdateRoleDTO) {
    return await this.commandBus.execute(new UpdateRoleCommand(roleIdDTO.id, updateRoleDTO))
  }

  @Patch(':id/status')
  @ResourceMethod('updateStatus')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '更新角色状态' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async updateStatus(@Param() roleIdDTO: RoleIdDTO, @Body() updateStatusDTO: UpdateStatusDTO) {
    return await this.commandBus.execute(new UpdateRoleStatusCommand(roleIdDTO.id, updateStatusDTO))
  }

  @Patch(':id/sort')
  @ResourceMethod('updateSort')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '更新角色排序优先级' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async updateSort(@Param() roleIdDTO: RoleIdDTO, @Body() updateSortDTO: UpdateSortDTO) {
    return await this.commandBus.execute(new UpdateRoleSortCommand(roleIdDTO.id, updateSortDTO))
  }

  @Get()
  @ResourceMethod('list')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '获取角色列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(FindAllRoleVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async list(@Query() findAllDTO: FindAllDTO) {
    return await this.queryBus.execute(new GetRolesQuery(findAllDTO))
  }

  @Get(':id')
  @ResourceMethod('detail')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '查看单个角色详情' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(RoleDetailsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async detail(@Param() roleIdDTO: RoleIdDTO) {
    return await this.queryBus.execute(new GetRoleByIdQuery(roleIdDTO.id))
  }

  @Patch(':id/move')
  @ResourceMethod('move')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '移动角色' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async move(@Param() roleIdDTO: RoleIdDTO, @Body() moveRoleDTO: MoveRoleDTO) {
    return await this.commandBus.execute(new MoveRoleCommand(roleIdDTO.id, moveRoleDTO))
  }

  @Get('tree/:id')
  @ResourceMethod('tree')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '查看单个角色树结构' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(RoleTreeVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async tree(@Param() roleIdDTO: RoleIdDTO, @Query() getTreeDepthDTO: GetTreeDepthDTO) {
    return await this.queryBus.execute(new GetRoleTreeQuery(roleIdDTO.id, getTreeDepthDTO))
  }

  @Post('trees')
  @ResourceMethod('trees')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '查看多个角色树结构' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(RoleTreeVO, true)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async trees(@Body() getTreesDTO: GetTreesDTO) {
    return await this.queryBus.execute(new GetRoleTreesQuery(getTreesDTO))
  }
}
