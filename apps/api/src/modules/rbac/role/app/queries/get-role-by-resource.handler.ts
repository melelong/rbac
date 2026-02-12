import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { RoleVOAssembler } from '@/modules/rbac/role/app'
import { RoleResourceService } from '../services'
import { GetRoleByResourceQuery } from './get-role-by-resource.query'

/** 获取资源的角色ID列表Handler */
@QueryHandler(GetRoleByResourceQuery)
export class GetRoleByResourceHandler implements IQueryHandler<GetRoleByResourceQuery> {
  constructor(private readonly roleResourceService: RoleResourceService) {}
  async execute(query: GetRoleByResourceQuery) {
    const [resource] = await this.roleResourceService.getRoleIdsByResourceIds({ ids: [query.id] })
    return RoleVOAssembler.toIdsVO(resource.roles)
  }
}
