import type { IUserController } from '../IUserController'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiExtraModels } from '@nestjs/swagger'
import { ResourceTypeEnum } from '@packages/types'
import { ApiController, ApiMethod, ResourceDomain, ResourceMethod, ResourceType } from '@/common/deco'
import { FindAllDTO, UpdateSortDTO, UpdateStatusDTO } from '@/common/dto'
import { ResVO } from '@/common/vo'
import {
  CreateUserByNameCommand,
  CreateUserDTO,
  DeleteUserCommand,
  FindAllUserVO,
  GetUserByIdQuery,
  GetUsersQuery,
  UpdateUserCommand,
  UpdateUserDTO,
  UpdateUserSortCommand,
  UpdateUserStatusCommand,
  UserDetailsVO,
  UserIdDTO,
} from '../../../app'

/** 用户控制器实现 */
@Controller('user')
@ResourceType(ResourceTypeEnum.API)
@ResourceDomain('USER')
@ApiController({ ApiTagsOptions: ['User'] })
@ApiExtraModels(FindAllUserVO, UserDetailsVO)
export class UserController implements IUserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @ResourceMethod('create')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '创建用户' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(UserDetailsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async create(@Body() createUserDTO: CreateUserDTO) {
    return await this.commandBus.execute(new CreateUserByNameCommand(createUserDTO))
  }

  @Delete(':id')
  @ResourceMethod('delete')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '删除用户' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async delete(@Param() userIdDTO: UserIdDTO) {
    return await this.commandBus.execute(new DeleteUserCommand(userIdDTO.id))
  }

  @Patch(':id')
  @ResourceMethod('update')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '更新用户' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async update(@Param() userIdDTO: UserIdDTO, @Body() updateUserDTO: UpdateUserDTO) {
    return await this.commandBus.execute(new UpdateUserCommand(userIdDTO.id, updateUserDTO))
  }

  @Patch(':id/status')
  @ResourceMethod('updateStatus')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '更新用户状态' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async updateStatus(@Param() userIdDTO: UserIdDTO, @Body() updateStatusDTO: UpdateStatusDTO) {
    return await this.commandBus.execute(new UpdateUserStatusCommand(userIdDTO.id, updateStatusDTO))
  }

  @Patch(':id/sort')
  @ResourceMethod('updateSort')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '更新用户排序优先级' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async updateSort(@Param() userIdDTO: UserIdDTO, @Body() updateSortDTO: UpdateSortDTO) {
    return await this.commandBus.execute(new UpdateUserSortCommand(userIdDTO.id, updateSortDTO))
  }

  @Get()
  @ResourceMethod('list')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '获取用户列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(FindAllUserVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async list(@Query() findAllDTO: FindAllDTO) {
    return await this.queryBus.execute(new GetUsersQuery(findAllDTO))
  }

  @Get(':id')
  @ResourceMethod('detail')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '查看单个用户详情' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(UserDetailsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async detail(@Param() userIdDTO: UserIdDTO) {
    return await this.queryBus.execute(new GetUserByIdQuery(userIdDTO.id))
  }
}
