import type { EntityManager } from 'typeorm'
import type { CreateUserOptions } from '../IUser'
import type { ITransactionTemplateStrategy } from '@/common/template'
import { UserBusiness, UserBusinessTextMap } from '@packages/types'
import { MD5 } from 'crypto-js'
import { BusinessException } from '@/common/exceptions'
import { uuid_v4 } from '@/common/utils'
import { RoleEntity } from '@/modules/system/role/entities/role.entity'
import { DEFAULT_ROLES } from '@/modules/system/role/role.constant'
import { UserEntity } from '../entities/user.entity'
import { UserProfileEntity } from '../entities/userProfile.entity'
import { UserVO } from '../vo'

export interface ICreateUserStrategyOptions {
  /** 创建参数 */
  createUserOptions: CreateUserOptions
  /** 操作者 */
  by: string
  /**
   * 密码明文加密
   * @param pwd 密码明文
   * @param userSalt 用户盐
   */
  encryptPassword: (pwd: string, userSalt: string) => Promise<string>
}

interface IValidateValue {
  /** 操作者 */
  by: string
}
export class CreateUserStrategy implements ITransactionTemplateStrategy<UserVO, IValidateValue> {
  private readonly createUserOptions: CreateUserOptions
  private readonly by: string
  private readonly encryptPassword: (pwd: string, userSalt: string) => Promise<string>
  constructor(options: ICreateUserStrategyOptions) {
    const { createUserOptions, by, encryptPassword } = options
    this.createUserOptions = createUserOptions
    this.by = by
    this.encryptPassword = encryptPassword
  }

  async validate(em: EntityManager): Promise<IValidateValue> {
    const { name, email } = this.createUserOptions
    const by = this.by
    const [hasUserName, hasEmail] = await Promise.all([
      em.findOne(UserEntity, { where: { name }, lock: { mode: 'pessimistic_write' } }),
      email ? em.findOne(UserProfileEntity, { where: { email }, lock: { mode: 'pessimistic_write' } }) : null,
    ])
    if (hasUserName) throw new BusinessException(UserBusiness.NAME_ALREADY_EXISTS, UserBusinessTextMap)
    if (hasEmail) throw new BusinessException(UserBusiness.EMAIL_ALREADY_EXISTS, UserBusinessTextMap)
    return { by }
  }

  async handler(em: EntityManager, { by }: IValidateValue) {
    const { name, email, pwd: password } = this.createUserOptions
    // 新用户
    const salt = uuid_v4()
    const pwd = await this.encryptPassword(password, salt)
    const now = new Date()
    const newUser = em.create(UserEntity, { name, salt, pwd, createdBy: by, createdAt: now, updatedBy: by, updatedAt: now })
    // 新档案
    const avatar = `https://cn.cravatar.com/avatar/${email ? MD5(email.toLowerCase()).toString() : ''}`
    const newProfile = em.create(UserProfileEntity, {
      email: email ?? null,
      avatar,
      createdBy: by,
      createdAt: now,
      updatedBy: by,
      updatedAt: now,
    })
    // 默认角色
    const role = await em.findOne(RoleEntity, { where: { roleCode: DEFAULT_ROLES.USER.roleCode } })
    if (!role) throw new BusinessException(UserBusiness.ROLE_NOT_FOUND, UserBusinessTextMap)

    newUser.profile = newProfile
    newUser.roles = [role]

    const user = await em.save(UserEntity, newUser)
    console.warn(user)
    return new UserVO(user)
  }
}
