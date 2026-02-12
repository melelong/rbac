import type { CreateUserDTO, UpdateUserDTO } from '../../../app'
import type { IUserDomainService } from '../IUserDomainService'
import type { FindAllDTO, UpdateSortDTO, UpdateStatusDTO } from '@/common/dto'
import type { AppConfigType } from '@/config'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MD5 } from 'crypto-js'
import { isUndefined } from 'lodash-es'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextClass } from '@/common/deco'
import { BusinessException, ExceptionCode, ExceptionCodeTextMap } from '@/common/exceptions'
import { sha256, uuid_v4, wordArray } from '@/common/utils'
import { APP_CONFIG_KEY } from '@/config'
import { UserProfileRepository, UserRepository } from '../../../infra/repo'
import { UserEntity, UserProfileEntity } from '../../entities'
import { UserValidateService } from './user-validate.service'

/** 用户领域服务实现 */
@Injectable()
@LogContextClass()
export class UserDomainService implements IUserDomainService {
  columns: string[]
  columnsProfile: string[]
  constructor(
    public readonly userRepo: UserRepository,
    public readonly profileRepo: UserProfileRepository,
    private readonly validateService: UserValidateService,
    private readonly configService: ConfigService,
  ) {
    // 获取表字段名
    this.columns = this.userRepo.metadata.columns.map((c) => c.propertyName)
    this.columnsProfile = this.profileRepo.metadata.columns.map((c) => c.propertyName)
  }

  async resetUsersPwd(em: EntityManager, idList: string[], pwdList: string[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== pwdList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const users = await this.getUsersByIds(idList, false, em)
    const profiles: UserProfileEntity[] = []
    for (let i = 0, len = users.length; i < len; i++) {
      const pwd = pwdList[i]
      const user = users[i]
      const _pwd = await this.encryptPwd(pwd, user.salt)
      user.pwd = _pwd
    }
    await Promise.all([this.userRepo.patch(users, by, em), this.profileRepo.patch(profiles, by, em)])
    return true
  }

  async encryptPwd(pwd: string, userSalt: string) {
    const { salt: APP_SALT } = this.configService.get<AppConfigType>(APP_CONFIG_KEY)!
    const HASH_SALT = wordArray(`${APP_SALT}:${userSalt}`)
    return sha256(pwd, HASH_SALT)
  }

  async comparePwd(currentPwd: string, userSalt: string, encryptedPwd: string) {
    const currentEncryptedPwd = await this.encryptPwd(currentPwd, userSalt)
    return currentEncryptedPwd === encryptedPwd
  }

  async createUsers(em: EntityManager, createDTOList: CreateUserDTO[], by: string = SYSTEM_DEFAULT_BY) {
    const nameList: string[] = []
    const emailList: string[] = []
    const phoneList: string[] = []
    const createList: UserEntity[] = []
    const now = new Date()
    const base = { createdBy: by, createdAt: now, updatedBy: by, updatedAt: now }
    for (let i = 0, len = createDTOList.length; i < len; i++) {
      const { name, pwd, email, phone } = createDTOList[i]
      nameList.push(name)
      if (email) emailList.push(email)
      if (phone) phoneList.push(phone)
      const createDTO = createDTOList[i]
      // 用户档案
      const avatar = `https://cn.cravatar.com/avatar/${email ? MD5(email.toLowerCase()).toString() : ''}`
      const profile = em.create(UserProfileEntity, { ...createDTO, ...base, avatar })
      // 默认角色，功能待实现
      // 默认第三方绑定，功能待实现
      // 用户
      const id = uuid_v4()
      const salt = uuid_v4()
      const _pwd = await this.encryptPwd(pwd, salt)
      createList.push(em.create(UserEntity, { ...createDTO, ...base, id, salt, pwd: _pwd, profile, roles: [] }))
    }
    await Promise.all([
      this.validateService.validateName(nameList, false, em),
      emailList.length > 0 ? this.validateService.validateEmail(emailList, false, em) : null,
      phoneList.length > 0 ? this.validateService.validatePhone(phoneList, false, em) : null,
    ])
    const users = await this.userRepo.addMany(createList, by, em)
    return users
  }

  async deleteUsers(em: EntityManager, idList: string[], by: string = SYSTEM_DEFAULT_BY) {
    const users = await this.getUsersByIds(idList, false, em)
    const profiles = users.map((user) => user.profile)
    // 删除用户
    await Promise.all([this.userRepo.deleteMany(users, by, em), this.profileRepo.deleteMany(profiles, by, em)])
    return true
  }

  async updateUsers(em: EntityManager, idList: string[], updateDTOList: UpdateUserDTO[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== updateDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const users = await this.getUsersByIds(idList, false, em)
    const nameList: string[] = []
    const emailList: string[] = []
    const phoneList: string[] = []
    for (let i = 0, len = users.length; i < len; i++) {
      const DTO = updateDTOList[i]
      const user = users[i]
      const { name, email, phone, remark } = DTO
      if (name) nameList.push(name)
      if (email) emailList.push(email)
      if (phone) phoneList.push(phone)
      // 与表字段名对比
      let hasData = false
      for (const [k, v] of Object.entries(DTO)) {
        if (isUndefined(v)) continue
        hasData = true
        if (this.columns.includes(k)) (user as any)[k] = v
        if (this.columnsProfile.includes(k)) (user.profile as any)[k] = v
      }
      if (remark) user.remark = remark
      // 没有修改数据
      if (!hasData) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    }
    await Promise.all([
      nameList.length > 0 ? this.validateService.validateName(nameList, false, em) : null,
      emailList.length > 0 ? this.validateService.validateEmail(emailList, false, em) : null,
      phoneList.length > 0 ? this.validateService.validatePhone(phoneList, false, em) : null,
    ])
    const profiles = users.map((user) => user.profile)
    await Promise.all([this.userRepo.patch(users, by, em), this.profileRepo.patch(profiles, by, em)])
    return true
  }

  async updateUsersStatus(em: EntityManager, idList: string[], updateStatusDTOList: UpdateStatusDTO[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== updateStatusDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const users = await this.getUsersByIds(idList, false, em)
    const profiles: UserProfileEntity[] = []
    for (let i = 0, len = users.length; i < len; i++) {
      const updateStatusDTO = updateStatusDTOList[i]
      const user = users[i]
      user.status = updateStatusDTO.status
      user.profile.status = updateStatusDTO.status
      profiles.push(user.profile)
    }
    await Promise.all([this.userRepo.patch(users, by, em), this.profileRepo.patch(profiles, by, em)])
    return true
  }

  async updateUsersSort(em: EntityManager, idList: string[], updateSortDTOList: UpdateSortDTO[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== updateSortDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const users = await this.getUsersByIds(idList, false, em)
    const profiles: UserProfileEntity[] = []
    for (let i = 0, len = users.length; i < len; i++) {
      const updateSortDTO = updateSortDTOList[i]
      const user = users[i]
      user.sort = updateSortDTO.sort
      user.profile.sort = updateSortDTO.sort
      profiles.push(user.profile)
    }
    await Promise.all([this.userRepo.patch(users, by, em), this.profileRepo.patch(profiles, by, em)])
    return true
  }

  async getUsers(findAllDTO: FindAllDTO, relations: boolean = false, em?: EntityManager) {
    return this.userRepo.findAll(findAllDTO, relations, em)
  }

  async getUsersByIds(idList: string[], relations: boolean = false, em?: EntityManager) {
    const users = await this.userRepo.findManyById(idList, relations, em)
    if (idList.length !== users.length) throw new BusinessException(ExceptionCode.USER_NOT_FOUND, ExceptionCodeTextMap)
    return users
  }

  async getUsersByNames(nameList: string[], relations: boolean = false, em?: EntityManager) {
    const users = await this.userRepo.findManyByName(nameList, relations, em)
    if (nameList.length !== users.length) throw new BusinessException(ExceptionCode.USER_NOT_FOUND, ExceptionCodeTextMap)
    return users
  }

  async getUsersByEmails(emailList: string[], em?: EntityManager) {
    const users = await this.userRepo.findManyByEmail(emailList, false, em)
    if (emailList.length !== users.length) throw new BusinessException(ExceptionCode.USER_NOT_FOUND, ExceptionCodeTextMap)
    return users
  }

  async getUsersByPhones(phoneList: string[], em?: EntityManager) {
    const users = await this.userRepo.findManyByPhone(phoneList, false, em)
    if (phoneList.length !== users.length) throw new BusinessException(ExceptionCode.USER_NOT_FOUND, ExceptionCodeTextMap)
    return users
  }
}
