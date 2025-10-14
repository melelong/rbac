import type { IPermissionController } from './IPermission'
import type { ILoggerCls } from '@/infrastructure/logger2/ILogger2'
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { SYSTEM_DEFAULT_BY, UPDATE_STATUS_VO } from '@/common/constants'
import { ApiController, ApiMethod } from '@/common/decorators'
import { FindAllDTO, UpdateStatusDTO } from '@/common/dto'
import { LOGGER_CLS } from '@/infrastructure/logger2/logger2.constant'
import { CreatePermissionDTO, PermissionIdDTO } from './dto'
import { PermissionService } from './permission.service'
import { FindAllPermissionVO, PermissionVO } from './vo'

@Controller('permission')
@ApiController({ ApiTagsOptions: ['系统管理-权限模块'] })
export class PermissionController implements IPermissionController {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly clsService: ClsService<ILoggerCls>,
  ) {}

  @Post()
  @ApiMethod({
    ApiOperationOptions: [{ summary: '创建权限' }],
    ApiResponseOptions: [{ type: PermissionVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async create(@Body() createPermissionDTO: CreatePermissionDTO) {
    const userInfo = this.clsService.get(LOGGER_CLS.USER_INFO)
    return await this.permissionService.create(createPermissionDTO, userInfo.id ?? SYSTEM_DEFAULT_BY)
  }

  @Get()
  @ApiMethod({
    ApiOperationOptions: [{ summary: '分页查询权限详情' }],
    ApiResponseOptions: [{ type: FindAllPermissionVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async findAll(@Query() findAllDTO: FindAllDTO) {
    return await this.permissionService.findAll(findAllDTO)
  }

  @Get(':id')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '查询权限详情' }],
    ApiResponseOptions: [{ type: PermissionVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async findOne(@Param() permissionIdDTO: PermissionIdDTO) {
    return await this.permissionService.findOneById(permissionIdDTO)
  }

  @Patch('status/:id')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '更新权限状态' }],
    ApiResponseOptions: [{ type: String, example: UPDATE_STATUS_VO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async updateStatus(@Param() permissionIdDTO: PermissionIdDTO, @Body() updateStatusDTO: UpdateStatusDTO) {
    const userInfo = this.clsService.get(LOGGER_CLS.USER_INFO)
    await this.permissionService.updateStatusById(permissionIdDTO, updateStatusDTO, userInfo.id ?? SYSTEM_DEFAULT_BY)
    return UPDATE_STATUS_VO
  }
}
