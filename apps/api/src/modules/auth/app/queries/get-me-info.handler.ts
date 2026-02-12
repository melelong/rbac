import type { IQueryHandler } from '@nestjs/cqrs'
import { UnauthorizedException } from '@nestjs/common'
import { QueryHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { REQ_CTX } from '@/common/infra'
import { UserDomainService } from '@/modules/rbac/user/domain'
import { AuthVOAssembler } from '../assemblers'
import { GetMeInfoQuery } from './get-me-info.query'

/** 获取当前登录用户信息Handler */
@QueryHandler(GetMeInfoQuery)
export class GetMeInfoHandler implements IQueryHandler<GetMeInfoQuery> {
  constructor(
    private readonly clsService: ClsService,
    private readonly userDomainService: UserDomainService,
  ) {}

  async execute(_: GetMeInfoQuery) {
    const currentUserId = this.clsService.get<string>(REQ_CTX.USER_ID)
    if (!currentUserId) throw new UnauthorizedException()
    const [user] = await this.userDomainService.getUsersByIds([currentUserId])
    return AuthVOAssembler.toMeInfo(user)
  }
}
