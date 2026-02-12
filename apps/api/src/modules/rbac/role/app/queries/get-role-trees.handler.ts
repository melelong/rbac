import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { RoleDomainService } from '../../domain'
import { RoleTreeVO } from '../vo'
import { GetRoleTreesQuery } from './get-role-trees.query'

/** 获取多个角色树节点Handler */
@QueryHandler(GetRoleTreesQuery)
export class GetRoleTreesHandler implements IQueryHandler<GetRoleTreesQuery> {
  constructor(private readonly roleDomainService: RoleDomainService) {}
  async execute(query: GetRoleTreesQuery) {
    const { ids, depth = -1 } = query.getTreesDTO
    const roleTrees = await this.roleDomainService.getRoleTreesByIds(ids, RoleTreeVO, depth)
    return roleTrees
  }
}
