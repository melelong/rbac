import type { EntityManager } from 'typeorm'
import type { IAuthUserService } from '../IAuthUserService'
import type { CreateUserDTO } from '@/modules/rbac/user/app'
import { Injectable } from '@nestjs/common'
import { LogContextClass } from '@/common/deco'
import { UserDomainService } from '@/modules/rbac/user/domain'
import { AuthDomainService } from '../../../domain'

/** 认证用户服务实现 */
@Injectable()
@LogContextClass()
export class AuthUserService implements IAuthUserService {
  constructor(
    private readonly authDomainService: AuthDomainService,
    // private readonly authUserRepo: AuthUserRepository,
    private readonly userDomainService: UserDomainService,
  ) {}

  async register(em: EntityManager, createUserDTOs: CreateUserDTO[], by: string) {
    const [user] = await this.userDomainService.createUsers(em, createUserDTOs, by)
    // 绑定
    console.warn(user)
    return true
  }
}
