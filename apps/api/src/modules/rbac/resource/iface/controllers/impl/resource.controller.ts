import type { IResourceController } from '../IResourceController'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiExtraModels } from '@nestjs/swagger'
import { ResourceTypeEnum } from '@packages/types'
import { ApiController, ApiMethod, ResourceDomain, ResourceMethod, ResourceType } from '@/common/deco'
import { FindAllDTO, UpdateSortDTO, UpdateStatusDTO } from '@/common/dto'
import { ResVO } from '@/common/vo'
import {
  CreateResourceByNameCommand,
  CreateResourceDTO,
  DeleteResourceCommand,
  FindAllResourceVO,
  GetResourceByIdQuery,
  GetResourcesQuery,
  ResourceDetailsVO,
  ResourceIdDTO,
  UpdateResourceCommand,
  UpdateResourceDTO,
  UpdateResourceSortCommand,
  UpdateResourceStatusCommand,
} from '../../../app'

/** 资源控制器实现 */
@Controller('resource')
@ResourceType(ResourceTypeEnum.API)
@ResourceDomain('RESOURCE')
@ApiController({ ApiTagsOptions: ['Resource'] })
@ApiExtraModels(FindAllResourceVO, ResourceDetailsVO)
export class ResourceController implements IResourceController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @ResourceMethod('create')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '创建资源' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(ResourceDetailsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async create(@Body() createResourceDTO: CreateResourceDTO) {
    return await this.commandBus.execute(new CreateResourceByNameCommand(createResourceDTO))
  }

  @Delete(':id')
  @ResourceMethod('delete')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '删除资源' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async delete(@Param() resourceIdDTO: ResourceIdDTO) {
    return await this.commandBus.execute(new DeleteResourceCommand(resourceIdDTO.id))
  }

  @Patch(':id')
  @ResourceMethod('update')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '更新资源' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async update(@Param() resourceIdDTO: ResourceIdDTO, @Body() updateResourceDTO: UpdateResourceDTO) {
    return await this.commandBus.execute(new UpdateResourceCommand(resourceIdDTO.id, updateResourceDTO))
  }

  @Patch(':id/status')
  @ResourceMethod('updateStatus')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '更新资源状态' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async updateStatus(@Param() resourceIdDTO: ResourceIdDTO, @Body() updateStatusDTO: UpdateStatusDTO) {
    return await this.commandBus.execute(new UpdateResourceStatusCommand(resourceIdDTO.id, updateStatusDTO))
  }

  @Patch(':id/sort')
  @ResourceMethod('updateSort')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '更新资源排序优先级' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async updateSort(@Param() resourceIdDTO: ResourceIdDTO, @Body() updateSortDTO: UpdateSortDTO) {
    return await this.commandBus.execute(new UpdateResourceSortCommand(resourceIdDTO.id, updateSortDTO))
  }

  @Get()
  @ResourceMethod('list')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '获取资源列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(FindAllResourceVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async list(@Query() findAllDTO: FindAllDTO) {
    return await this.queryBus.execute(new GetResourcesQuery(findAllDTO))
  }

  @Get(':id')
  @ResourceMethod('detail')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '查看单个资源详情' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(ResourceDetailsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async detail(@Param() resourceIdDTO: ResourceIdDTO) {
    return await this.queryBus.execute(new GetResourceByIdQuery(resourceIdDTO.id))
  }
}
