import type { ModuleMetadata } from '@nestjs/common'
import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'
import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  CreateMenuByNameHandler,
  DeleteMenuHandler,
  GetMenuByIdHandler,
  GetMenusHandler,
  GetMenuTreeHandler,
  GetMenuTreesHandler,
  MoveMenuHandler,
  UpdateMenuHandler,
  UpdateMenuSortHandler,
  UpdateMenuStatusHandler,
} from './app'
import { MenuDomainListener, MenuDomainService, MenuEntity, MenuTreeEntity, MenuValidateService } from './domain'
import { MenuController } from './iface/controllers'
import { MenuRepository, MenuTreeRepository } from './infra/repo'

/** 实体 */
const entities: EntityClassOrSchema[] = [MenuEntity, MenuTreeEntity]
/** 控制器 */
const controllers: ModuleMetadata['controllers'] = [MenuController]
/** 命令处理 */
const commandHandlers: ModuleMetadata['providers'] = [
  CreateMenuByNameHandler,
  DeleteMenuHandler,
  UpdateMenuHandler,
  UpdateMenuSortHandler,
  UpdateMenuStatusHandler,
  MoveMenuHandler,
]
/** 查询处理 */
const queryHandlers: ModuleMetadata['providers'] = [GetMenusHandler, GetMenuByIdHandler, GetMenuTreeHandler, GetMenuTreesHandler]
/** 事件处理 */
const eventHandlers: ModuleMetadata['providers'] = [MenuDomainListener]
/** 服务 */
const services: ModuleMetadata['providers'] = [MenuValidateService, MenuDomainService]
/** 仓库 */
const repo: ModuleMetadata['providers'] = [MenuRepository, MenuTreeRepository]
/** 菜单模块 */
@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers,
  providers: [...repo, ...services, ...commandHandlers, ...queryHandlers, ...eventHandlers],
  exports: [...repo, ...services, ...commandHandlers, ...queryHandlers, ...eventHandlers],
})
export class MenuModule {}
