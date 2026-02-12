import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra'
import { CrudRepositoryTemplate } from '@/common/template'
import { AuthEntity, IAuthRepository } from '../../domain'

/** 认证仓库实现 */
@Injectable()
@LogContextClass()
export class AuthRepository extends CrudRepositoryTemplate<AuthEntity> implements IAuthRepository {
  constructor(
    protected readonly em: EntityManager,
    protected readonly loggingService: LoggingService,
  ) {
    super(AuthEntity, em, loggingService)
  }
}
