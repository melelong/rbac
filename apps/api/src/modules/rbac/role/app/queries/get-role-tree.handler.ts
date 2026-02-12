import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { RoleDomainService } from '../../domain'
import { RoleTreeVO } from '../vo'
import { GetRoleTreeQuery } from './get-role-tree.query'

/** 获取单个角色树节点Handler */
@QueryHandler(GetRoleTreeQuery)
export class GetRoleTreeHandler implements IQueryHandler<GetRoleTreeQuery> {
  constructor(private readonly roleDomainService: RoleDomainService) {}
  async execute(query: GetRoleTreeQuery) {
    const {
      id,
      getTreeDepthDTO: { depth = -1 },
    } = query
    const [roleTree] = await this.roleDomainService.getRoleTreesByIds([id], RoleTreeVO, depth)
    return roleTree
  }
}
