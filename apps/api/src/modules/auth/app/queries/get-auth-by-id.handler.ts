import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { AuthDomainService } from '../../domain'
import { AuthVOAssembler } from '../assemblers'
import { GetAuthByIdQuery } from './get-auth-by-id.query'

/** 获取认证详情Handler */
@QueryHandler(GetAuthByIdQuery)
export class GetAuthByIdHandler implements IQueryHandler<GetAuthByIdQuery> {
  constructor(private readonly authDomainService: AuthDomainService) {}
  async execute(query: GetAuthByIdQuery) {
    const [auth] = await this.authDomainService.getAuthsByIds([query.id])
    return AuthVOAssembler.toDetailsVO(auth)
  }
}
