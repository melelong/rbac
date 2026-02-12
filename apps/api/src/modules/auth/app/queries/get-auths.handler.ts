import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { AuthDomainService } from '../../domain'
import { AuthVOAssembler } from '../assemblers'
import { GetAuthsQuery } from './get-auths.query'

/** 获取认证列表Handler */
@QueryHandler(GetAuthsQuery)
export class GetAuthsHandler implements IQueryHandler<GetAuthsQuery> {
  constructor(private readonly authDomainService: AuthDomainService) {}
  async execute(query: GetAuthsQuery) {
    const { limit = 10, page = 1 } = query.findAllDTO
    const [data, total] = await this.authDomainService.getAuths(query.findAllDTO)
    return AuthVOAssembler.toFindAllVO({ data, limit, page, total })
  }
}
