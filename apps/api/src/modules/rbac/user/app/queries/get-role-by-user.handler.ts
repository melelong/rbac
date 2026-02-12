import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { RoleVOAssembler } from '@/modules/rbac/role/app'
import { UserRoleService } from '../services'
import { GetRoleByUserQuery } from './get-role-by-user.query'

/** 获取用户的角色ID列表Handler */
@QueryHandler(GetRoleByUserQuery)
export class GetRoleByUserHandler implements IQueryHandler<GetRoleByUserQuery> {
  constructor(private readonly userRoleService: UserRoleService) {}
  async execute(query: GetRoleByUserQuery) {
    const [user] = await this.userRoleService.getRoleIdsByUserId({ ids: [query.id] })
    return RoleVOAssembler.toIdsVO(user.roles)
  }
}
