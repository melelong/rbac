import type { EntityManager } from 'typeorm'
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import type { UpdateUserDTO, UserIdDTO } from '../dto'
import type { ITransactionTemplateStrategy } from '@/common/template'
import { CommonBusiness, CommonBusinessTextMap, UserBusiness, UserBusinessTextMap } from '@packages/types'
import { isUndefined } from 'lodash-es'
import { Not } from 'typeorm'
import { BusinessException } from '@/common/exceptions'
import { UserEntity } from '../entities/user.entity'
import { UserProfileEntity } from '../entities/userProfile.entity'

export interface IUpdateUserStrategyOptions {
  /** 用户ID */
  userIdDTO: UserIdDTO
  /** 更新参数 */
  updateUserDTO: UpdateUserDTO
  /** 操作者 */
  by: string
  /** 实体管理对象 */
  entityManager: EntityManager
}

interface IValidateValue {
  /** 用户档案ID */
  profileId: string
  /** 操作者 */
  by: string
  /** 更新用户参数 */
  updateUser: QueryDeepPartialEntity<UserEntity>
  /** 更新用户档案参数 */
  updateUserProfile: QueryDeepPartialEntity<UserProfileEntity>
  /** 用户ID */
  id: string
}

export class UpdateUserStrategy implements ITransactionTemplateStrategy<boolean, IValidateValue> {
  // 缓存表字段名
  private readonly columnsUser: string[]
  private readonly columnsUserProfile: string[]
  private readonly userIdDTO: UserIdDTO
  private readonly updateUserDTO: UpdateUserDTO
  private readonly by: string
  private readonly entityManager: EntityManager
  constructor(options: IUpdateUserStrategyOptions) {
    const { userIdDTO, updateUserDTO, by, entityManager } = options
    this.userIdDTO = userIdDTO
    this.updateUserDTO = updateUserDTO
    this.by = by
    this.entityManager = entityManager

    // 获取表字段名
    this.columnsUser = this.entityManager.getRepository(UserEntity).metadata.columns.map((c) => c.propertyName)
    this.columnsUserProfile = this.entityManager.getRepository(UserProfileEntity).metadata.columns.map((c) => c.propertyName)
  }

  async validate(em: EntityManager): Promise<IValidateValue> {
    const { id } = this.userIdDTO
    const by = this.by
    // 看看哪个参数是哪个表的
    const updateUser: QueryDeepPartialEntity<UserEntity> = {}
    const updateUserProfile: QueryDeepPartialEntity<UserProfileEntity> = {}
    let hasData = false
    for (const [k, v] of Object.entries(this.updateUserDTO)) {
      // 没有就下一个
      if (isUndefined(v)) continue
      hasData = true
      // 是否为用户表参数
      if (this.columnsUser.includes(k)) (updateUser as any)[k] = v
      // 是否为用户档案表参数
      if (this.columnsUserProfile.includes(k)) (updateUserProfile as any)[k] = v
    }
    if (!hasData) throw new BusinessException(CommonBusiness.PROMPT_FOR_MODIFICATION, CommonBusinessTextMap)

    const user = await em.findOne(UserEntity, { where: { id }, lock: { mode: 'pessimistic_write' } })
    if (!user) throw new BusinessException(UserBusiness.NOT_FOUND, UserBusinessTextMap)

    // 唯一性校验（复用同事务，防止幻读）
    // 并行校验
    const profileId = user.profile.id
    const [nameExist, emailExist, phoneExist] = await Promise.all([
      updateUser.name
        ? em.exists(UserEntity, {
            where: { name: updateUser.name as string, id: Not(id) },
            lock: { mode: 'pessimistic_write' },
          })
        : null,
      updateUserProfile.email
        ? em.exists(UserProfileEntity, {
            where: { email: updateUserProfile.email as string, id: Not(profileId) },
            lock: { mode: 'pessimistic_write' },
          })
        : null,
      updateUserProfile.phone
        ? em.exists(UserProfileEntity, {
            where: { phone: updateUserProfile.phone as string, id: Not(profileId) },
            lock: { mode: 'pessimistic_write' },
          })
        : null,
    ])
    if (nameExist) throw new BusinessException(UserBusiness.NAME_ALREADY_EXISTS, UserBusinessTextMap)
    if (emailExist) throw new BusinessException(UserBusiness.EMAIL_ALREADY_EXISTS, UserBusinessTextMap)
    if (phoneExist) throw new BusinessException(UserBusiness.PHONE_ALREADY_EXISTS, UserBusinessTextMap)

    return { updateUser, updateUserProfile, profileId: user.profile.id, by, id }
  }

  async handler(em: EntityManager, { updateUser, updateUserProfile, profileId, by, id }: IValidateValue) {
    const now = new Date()
    updateUser.updatedBy = by
    updateUser.updatedAt = now
    updateUserProfile.updatedBy = by
    updateUserProfile.updatedAt = now
    await Promise.all([em.update(UserEntity, { id }, updateUser), em.update(UserProfileEntity, { id: profileId }, updateUserProfile)])
    return true
  }
}
