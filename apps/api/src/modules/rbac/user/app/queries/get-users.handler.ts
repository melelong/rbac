import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { UserDomainService } from '../../domain'
import { UserVOAssembler } from '../assemblers'
import { GetUsersQuery } from './get-users.query'

/** 获取用户列表Handler */
@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly userDomainService: UserDomainService) {}
  async execute(query: GetUsersQuery) {
    const { limit = 10, page = 1 } = query.findAllDTO
    const [data, total] = await this.userDomainService.getUsers(query.findAllDTO)
    return UserVOAssembler.toFindAllVO({ data, limit, page, total })
  }
}
