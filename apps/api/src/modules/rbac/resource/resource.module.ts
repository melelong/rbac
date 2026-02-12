import type { ModuleMetadata } from '@nestjs/common'
import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'
import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  CreateResourceByNameHandler,
  DeleteResourceHandler,
  GetResourceByIdHandler,
  GetResourcesHandler,
  UpdateResourceHandler,
  UpdateResourceSortHandler,
  UpdateResourceStatusHandler,
} from './app'
import { ResourceDomainListener, ResourceDomainService, ResourceEntity, ResourceValidateService } from './domain'
import { ResourceController } from './iface/controllers'
import { ResourceRepository } from './infra/repo'

/** 实体 */
const entities: EntityClassOrSchema[] = [ResourceEntity]
/** 控制器 */
const controllers: ModuleMetadata['controllers'] = [ResourceController]
/** 命令处理 */
const commandHandlers: ModuleMetadata['providers'] = [
  CreateResourceByNameHandler,
  DeleteResourceHandler,
  UpdateResourceHandler,
  UpdateResourceSortHandler,
  UpdateResourceStatusHandler,
]
/** 查询处理 */
const queryHandlers: ModuleMetadata['providers'] = [GetResourcesHandler, GetResourceByIdHandler]
/** 事件处理 */
const eventHandlers: ModuleMetadata['providers'] = [ResourceDomainListener]
/** 服务 */
const services: ModuleMetadata['providers'] = [ResourceValidateService, ResourceDomainService]
/** 仓库 */
const repo: ModuleMetadata['providers'] = [ResourceRepository]
/** 资源模块 */
@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers,
  providers: [...repo, ...services, ...commandHandlers, ...queryHandlers, ...eventHandlers],
  exports: [...repo, ...services, ...commandHandlers, ...queryHandlers, ...eventHandlers],
})
export class ResourceModule {}
