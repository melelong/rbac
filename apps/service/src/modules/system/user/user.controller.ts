import type { IUserController } from './IUser'
import type { ILoggerCls } from '@/infrastructure/logger2/ILogger2'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { DEL_BY_ID_VO, SYSTEM_DEFAULT_BY, UPDATE_STATUS_VO, UPDATE_VO } from '@/common/constants'
import { ApiController, ApiMethod } from '@/common/decorators'
import { FindAllDTO, UpdateStatusDTO } from '@/common/dto'
import { JwtGuard } from '@/common/guards/jwt.guard'
import { LOGGER_CLS } from '@/infrastructure/logger2/logger2.constant'
import { AssignRolesByIdsDTO, CreateUserDTO, UpdateUserDTO, UserIdDTO } from './dto'
import { UserService } from './user.service'
import { FindAllUserVO, UserVO } from './vo'

@Controller('system/user')
@ApiController({ ApiTagsOptions: ['系统管理-用户模块'] })
export class UserController implements IUserController {
  constructor(
    private readonly userService: UserService,
    private readonly clsService: ClsService<ILoggerCls>,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  @ApiMethod({
    ApiOperationOptions: [{ summary: '创建用户' }],
    ApiResponseOptions: [{ type: UserVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async create(@Body() createUserDTO: CreateUserDTO) {
    const userInfo = this.clsService.get(LOGGER_CLS.USER_INFO)
    return await this.userService.create(createUserDTO, userInfo.id ?? SYSTEM_DEFAULT_BY)
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '删除用户' }],
    ApiResponseOptions: [{ type: String, example: DEL_BY_ID_VO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async delete(@Param() userIdDTO: UserIdDTO) {
    const userInfo = this.clsService.get(LOGGER_CLS.USER_INFO)
    await this.userService.delById(userIdDTO, userInfo.id ?? SYSTEM_DEFAULT_BY)
    return DEL_BY_ID_VO
  }

  @UseGuards(JwtGuard)
  @Get()
  @ApiMethod({
    ApiOperationOptions: [{ summary: '分页查询用户详情' }],
    ApiResponseOptions: [{ type: FindAllUserVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async findAll(@Query() findAllDTO: FindAllDTO) {
    return await this.userService.findAll(findAllDTO)
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '查询用户详情' }],
    ApiResponseOptions: [{ type: UserVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async findOne(@Param() userIdDTO: UserIdDTO) {
    return await this.userService.findOneById(userIdDTO.id)
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '更新用户' }],
    ApiResponseOptions: [{ type: String, example: UPDATE_VO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async update(@Param() userIdDTO: UserIdDTO, @Body() updateUserDTO: UpdateUserDTO) {
    const userInfo = this.clsService.get(LOGGER_CLS.USER_INFO)
    await this.userService.update(userIdDTO, updateUserDTO, userInfo.id ?? SYSTEM_DEFAULT_BY)
    return UPDATE_VO
  }

  @UseGuards(JwtGuard)
  @Patch('status/:id')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '更新用户状态' }],
    ApiResponseOptions: [{ type: String, example: UPDATE_STATUS_VO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async updateStatus(@Param() userIdDTO: UserIdDTO, @Body() updateStatusDTO: UpdateStatusDTO) {
    const userInfo = this.clsService.get(LOGGER_CLS.USER_INFO)
    await this.userService.updateStatusById(userIdDTO, updateStatusDTO, userInfo.id ?? SYSTEM_DEFAULT_BY)
    return UPDATE_STATUS_VO
  }

  @UseGuards(JwtGuard)
  @Post(':id/roles')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '分配角色' }],
    ApiResponseOptions: [{ type: String, example: UPDATE_VO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async assignRoles(@Body() assignRolesByIdsDTO: AssignRolesByIdsDTO) {
    const userInfo = this.clsService.get(LOGGER_CLS.USER_INFO)
    await this.userService.assignRolesByIds(assignRolesByIdsDTO, userInfo.id ?? SYSTEM_DEFAULT_BY)
    return UPDATE_VO
  }
}
