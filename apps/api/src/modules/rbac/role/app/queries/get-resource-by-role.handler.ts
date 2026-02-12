import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { ResourceVOAssembler } from '@/modules/rbac/resource/app'
import { RoleResourceService } from '../services'
import { GetResourceByRoleQuery } from './get-resource-by-role.query'

/** 获取角色的资源ID列表Handler */
@QueryHandler(GetResourceByRoleQuery)
export class GetResourceByRoleHandler implements IQueryHandler<GetResourceByRoleQuery> {
  constructor(private readonly roleResourceService: RoleResourceService) {}
  async execute(query: GetResourceByRoleQuery) {
    const [role] = await this.roleResourceService.getResourceIdsByRoleIds({ ids: [query.id] })
    return ResourceVOAssembler.toIdsVO(role.resources)
  }
}
