import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { UserDomainService } from '../../domain'
import { UserVOAssembler } from '../assemblers'
import { GetUserByIdQuery } from './get-user-by-id.query'

/** 获取用户详情Handler */
@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly userDomainService: UserDomainService) {}
  async execute(query: GetUserByIdQuery) {
    const [user] = await this.userDomainService.getUsersByIds([query.id])
    return UserVOAssembler.toDetailsVO(user)
  }
}
