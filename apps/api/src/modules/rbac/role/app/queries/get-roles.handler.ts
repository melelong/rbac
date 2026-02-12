import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { RoleDomainService } from '../../domain'
import { RoleVOAssembler } from '../assemblers'
import { GetRolesQuery } from './get-roles.query'

/** 获取角色列表Handler */
@QueryHandler(GetRolesQuery)
export class GetRolesHandler implements IQueryHandler<GetRolesQuery> {
  constructor(private readonly roleDomainService: RoleDomainService) {}
  async execute(query: GetRolesQuery) {
    const { limit = 10, page = 1 } = query.findAllDTO
    const [data, total] = await this.roleDomainService.getRoles(query.findAllDTO)
    return RoleVOAssembler.toFindAllVO({ data, limit, page, total })
  }
}
