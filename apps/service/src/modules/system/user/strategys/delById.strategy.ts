import type { EntityManager } from 'typeorm'
import type { UserIdDTO } from '../dto'
import type { ITransactionTemplateStrategy } from '@/common/template'
import { UserBusiness, UserBusinessTextMap } from '@packages/types'
import { BusinessException } from '@/common/exceptions'
import { UserEntity } from '../entities/user.entity'
import { UserProfileEntity } from '../entities/userProfile.entity'

export interface IDelByIdUserStrategyOptions {
  /** 用户ID */
  userIdDTO: UserIdDTO
  /** 操作者 */
  by: string
  /** 内置用户名 */
  builtInUserNames: {
    superAdminName: string
    adminName: string
    userName: string
  }
  /**
   * 删除redis中的token信息
   * @param userId 用户ID
   */
  delRedisToken: (userId: string) => Promise<void>
}

interface IValidateValue {
  /** 用户档案ID */
  profileId: string
  /** 用户ID */
  id: string
  /** 操作者 */
  by: string
}

export class DelByIdUserStrategy implements ITransactionTemplateStrategy<boolean, IValidateValue> {
  private readonly userIdDTO: UserIdDTO
  private readonly by: string
  private readonly builtInUserNames: {
    superAdminName: string
    adminName: string
    userName: string
  }

  private readonly delRedisToken: (userId: string) => Promise<void>
  constructor(options: IDelByIdUserStrategyOptions) {
    const { userIdDTO, by, builtInUserNames, delRedisToken } = options
    this.userIdDTO = userIdDTO
    this.by = by
    this.builtInUserNames = builtInUserNames
    this.delRedisToken = delRedisToken
  }

  async validate(em: EntityManager): Promise<IValidateValue> {
    const { id } = this.userIdDTO
    const by = this.by
    const user = await em.findOne(UserEntity, { where: { id }, lock: { mode: 'pessimistic_write' } })
    if (!user) throw new BusinessException(UserBusiness.NOT_FOUND, UserBusinessTextMap)
    const { superAdminName, adminName, userName } = this.builtInUserNames
    if (user.name === superAdminName || user.name === adminName || user.name === userName)
      throw new BusinessException(UserBusiness.CANNOT_DELETE_BUILT_IN_USER, UserBusinessTextMap)

    return { profileId: user.profile.id, id, by }
  }

  async handler(em: EntityManager, { profileId, id, by }: IValidateValue) {
    const now = new Date()
    await Promise.all([
      em.update(UserEntity, { id }, { deletedAt: now, deletedBy: by }),
      em.update(UserProfileEntity, { id: profileId }, { deletedAt: now, deletedBy: by }),
      this.delRedisToken(id),
    ])
    return true
  }
}
