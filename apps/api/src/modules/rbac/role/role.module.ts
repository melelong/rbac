import type { ModuleMetadata } from '@nestjs/common'
import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'
import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  AssignRoleMenuHandler,
  AssignRoleResourceHandler,
  AssignRolesMenuHandler,
  AssignRolesResourceHandler,
  CreateRoleByNameHandler,
  DeleteRoleHandler,
  GetMenuByRoleHandler,
  GetResourceByRoleHandler,
  GetRoleByIdHandler,
  GetRoleByMenuHandler,
  GetRoleByResourceHandler,
  GetRolesHandler,
  GetRoleTreeHandler,
  GetRoleTreesHandler,
  MoveRoleHandler,
  RoleMenuService,
  RoleResourceService,
  UpdateRoleHandler,
  UpdateRoleSortHandler,
  UpdateRoleStatusHandler,
} from './app'
import { RoleDomainListener, RoleDomainService, RoleEntity, RoleTreeEntity, RoleValidateService } from './domain'
import { RoleController, RoleMenuController, RoleResourceController } from './iface/controllers'
import { RoleMenuRepository, RoleRepository, RoleResourceRepository, RoleTreeRepository } from './infra/repo'

/** 实体 */
const entities: EntityClassOrSchema[] = [RoleEntity, RoleTreeEntity]
/** 控制器 */
const controllers: ModuleMetadata['controllers'] = [RoleController, RoleMenuController, RoleResourceController]
/** 命令处理 */
const commandHandlers: ModuleMetadata['providers'] = [
  CreateRoleByNameHandler,
  DeleteRoleHandler,
  UpdateRoleHandler,
  UpdateRoleSortHandler,
  UpdateRoleStatusHandler,
  MoveRoleHandler,
  AssignRoleMenuHandler,
  AssignRolesMenuHandler,
  AssignRoleResourceHandler,
  AssignRolesResourceHandler,
]
/** 查询处理 */
const queryHandlers: ModuleMetadata['providers'] = [
  GetRolesHandler,
  GetRoleByIdHandler,
  GetRoleTreeHandler,
  GetRoleTreesHandler,
  GetMenuByRoleHandler,
  GetResourceByRoleHandler,
  GetRoleByMenuHandler,
  GetRoleByResourceHandler,
]
/** 事件处理 */
const eventHandlers: ModuleMetadata['providers'] = [RoleDomainListener]
/** 服务 */
const services: ModuleMetadata['providers'] = [RoleValidateService, RoleDomainService, RoleMenuService, RoleResourceService]
/** 仓库 */
const repo: ModuleMetadata['providers'] = [RoleRepository, RoleTreeRepository, RoleResourceRepository, RoleMenuRepository]
/** 角色模块 */
@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers,
  providers: [...repo, ...services, ...commandHandlers, ...queryHandlers, ...eventHandlers],
  exports: [...repo, ...services, ...commandHandlers, ...queryHandlers, ...eventHandlers],
})
export class RoleModule {}
