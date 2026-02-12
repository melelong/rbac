import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { RoleDomainService } from '../../domain'
import { RoleVOAssembler } from '../assemblers'
import { GetRoleByIdQuery } from './get-role-by-id.query'

/** 获取角色详情Handler */
@QueryHandler(GetRoleByIdQuery)
export class GetRoleByIdHandler implements IQueryHandler<GetRoleByIdQuery> {
  constructor(private readonly roleDomainService: RoleDomainService) {}
  async execute(query: GetRoleByIdQuery) {
    const [role] = await this.roleDomainService.getRolesByIds([query.id])
    return RoleVOAssembler.toDetailsVO(role)
  }
}
