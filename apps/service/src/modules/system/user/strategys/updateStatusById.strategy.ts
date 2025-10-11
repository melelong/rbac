import type { StatusEnum } from '@packages/types'
import type { EntityManager } from 'typeorm'
import type { UserIdDTO } from '../dto'
import type { UpdateStatusDTO } from '@/common/dto'
import type { ITransactionTemplateStrategy } from '@/common/template'
import { UserBusiness, UserBusinessTextMap } from '@packages/types'
import { BusinessException } from '@/common/exceptions'
import { UserEntity } from '../entities/user.entity'
import { UserProfileEntity } from '../entities/userProfile.entity'

export interface IUpdateStatusByIdStrategyOptions {
  /** 用户ID */
  userIdDTO: UserIdDTO
  /** 更新状态参数 */
  updateStatusDTO: UpdateStatusDTO
  /** 操作者 */
  by: string
}

interface IValidateValue {
  /** 用户ID */
  id: string
  /** 用户档案ID */
  profileId: string
  /** 操作者 */
  by: string
  /** 状态 */
  status: StatusEnum
}
export class UpdateStatusByIdStrategy implements ITransactionTemplateStrategy<boolean, IValidateValue> {
  private readonly userIdDTO: UserIdDTO
  private readonly updateStatusDTO: UpdateStatusDTO
  private readonly by: string
  constructor(options: IUpdateStatusByIdStrategyOptions) {
    const { userIdDTO, updateStatusDTO, by } = options
    this.userIdDTO = userIdDTO
    this.updateStatusDTO = updateStatusDTO
    this.by = by
  }

  async validate(em: EntityManager): Promise<IValidateValue> {
    const { id } = this.userIdDTO
    const { status } = this.updateStatusDTO
    const by = this.by
    const user = await em.findOne(UserEntity, { where: { id }, lock: { mode: 'pessimistic_write' } })
    if (!user) throw new BusinessException(UserBusiness.NOT_FOUND, UserBusinessTextMap)
    return { id, profileId: user.profile.id, by, status }
  }

  async handler(em: EntityManager, { profileId, id, status, by }: IValidateValue) {
    const now = new Date()
    await Promise.all([
      em.update(UserEntity, { id }, { status, updatedBy: by, updatedAt: now }),
      em.update(UserProfileEntity, { id: profileId }, { status, updatedBy: by, updatedAt: now }),
    ])
    return true
  }
}
