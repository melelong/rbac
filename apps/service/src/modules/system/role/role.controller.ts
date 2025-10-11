import type { IRoleController } from './IRole'
import type { ILoggerCls } from '@/infrastructure/logger2/ILogger2'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { DEL_BY_ID_VO, SYSTEM_DEFAULT_BY, UPDATE_STATUS_VO, UPDATE_VO } from '@/common/constants'
import { ApiController, ApiMethod } from '@/common/decorators'
import { FindAllDTO, UpdateStatusDTO } from '@/common/dto'
import { JwtGuard } from '@/common/guards/jwt.guard'
import { LOGGER_CLS } from '@/infrastructure/logger2/logger2.constant'
import { AssignPermissionsByIdsDTO, CreateRoleDTO, RoleIdDTO } from './dto'
import { RoleService } from './role.service'
import { FindAllRoleVO, RoleVO } from './vo'

@Controller('system/role')
@ApiController({ ApiTagsOptions: ['系统管理-角色模块'] })
export class RoleController implements IRoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly clsService: ClsService<ILoggerCls>,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  @ApiMethod({
    ApiOperationOptions: [{ summary: '创建角色' }],
    ApiResponseOptions: [{ type: RoleVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async create(@Body() createRoleDTO: CreateRoleDTO) {
    const userInfo = this.clsService.get(LOGGER_CLS.USER_INFO)
    return await this.roleService.create(createRoleDTO, userInfo.id ?? SYSTEM_DEFAULT_BY)
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '删除角色' }],
    ApiResponseOptions: [{ type: String, example: DEL_BY_ID_VO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async delete(@Param() roleIdDTO: RoleIdDTO) {
    const userInfo = this.clsService.get(LOGGER_CLS.USER_INFO)
    await this.roleService.delById(roleIdDTO, userInfo.id ?? SYSTEM_DEFAULT_BY)
    return DEL_BY_ID_VO
  }

  @UseGuards(JwtGuard)
  @Get()
  @ApiMethod({
    ApiOperationOptions: [{ summary: '分页查询角色详情' }],
    ApiResponseOptions: [{ type: FindAllRoleVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async findAll(@Query() findAllDTO: FindAllDTO) {
    return await this.roleService.findAll(findAllDTO)
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '查询角色详情' }],
    ApiResponseOptions: [{ type: RoleVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async findOne(@Param() roleIdDTO: RoleIdDTO) {
    return await this.roleService.findOneById(roleIdDTO)
  }

  @UseGuards(JwtGuard)
  @Patch('status/:id')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '更新角色状态' }],
    ApiResponseOptions: [{ type: String, example: UPDATE_STATUS_VO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async updateStatus(@Param() roleIdDTO: RoleIdDTO, @Body() updateStatusDTO: UpdateStatusDTO) {
    const userInfo = this.clsService.get(LOGGER_CLS.USER_INFO)
    await this.roleService.updateStatusById(roleIdDTO, updateStatusDTO, userInfo.id ?? SYSTEM_DEFAULT_BY)
    return UPDATE_STATUS_VO
  }

  @UseGuards(JwtGuard)
  @Post(':id/permissions')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '分配权限' }],
    ApiResponseOptions: [{ type: String, example: UPDATE_VO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async assignPermissions(@Body() assignPermissionsByIdsDTO: AssignPermissionsByIdsDTO) {
    const userInfo = this.clsService.get(LOGGER_CLS.USER_INFO)
    await this.roleService.assignPermissionsByIds(assignPermissionsByIdsDTO, userInfo.id ?? SYSTEM_DEFAULT_BY)
    return UPDATE_VO
  }
}
