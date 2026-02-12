import type { IUserProfileRepository } from '../../domain'
import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra'
import { CrudRepositoryTemplate } from '@/common/template'
import { UserProfileEntity } from '../../domain'

/** 用户档案仓库实现 */
@Injectable()
@LogContextClass()
export class UserProfileRepository extends CrudRepositoryTemplate<UserProfileEntity> implements IUserProfileRepository {
  constructor(
    protected readonly em: EntityManager,
    protected readonly loggingService: LoggingService,
  ) {
    super(UserProfileEntity, em, loggingService)
  }
}
