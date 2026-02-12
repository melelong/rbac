import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { UserVOAssembler } from '../assemblers'
import { UserRoleService } from '../services'
import { GetUserByRoleQuery } from './get-user-by-role.query'

/** 获取角色的用户ID列表Handler */
@QueryHandler(GetUserByRoleQuery)
export class GetUserByRoleHandler implements IQueryHandler<GetUserByRoleQuery> {
  constructor(private readonly userRoleService: UserRoleService) {}
  async execute(query: GetUserByRoleQuery) {
    const [role] = await this.userRoleService.getUserIdsByRoleIds({ ids: [query.id] })
    return UserVOAssembler.toIdsVO(role.users)
  }
}
