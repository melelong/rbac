import type { AssignRolesByCodesDTO, AssignRolesByIdsDTO, UpdateUserDTO, UserIdDTO, UserNameDTO } from './dto'
import type { CreateUserOptions, IUserService } from './IUser'
import type { FindAllDTO, UpdateStatusDTO } from '@/common/dto'
import type { AppConfigType } from '@/configs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UserBusiness, UserBusinessTextMap } from '@packages/types'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { BusinessException } from '@/common/exceptions'
import { BusinessTemplate } from '@/common/template'
import { sha256, uuid_v4, wordArray } from '@/common/utils'
import { APP_CONFIG_KEY } from '@/configs'
import { Cache2Service } from '@/infrastructure/cache2/cache2.service'
import { Jwt2Service } from '@/infrastructure/jwt2/jwt2.service'
import { UserEntity } from './entities/user.entity'
import {
  AssignRolesByCodesStrategy,
  AssignRolesByIdsStrategy,
  CreateUserStrategy,
  DelByIdUserStrategy,
  UpdateStatusByIdStrategy,
  UpdateUserStrategy,
} from './strategys'
import { FindAllUserVO, UserVO } from './vo'

@Injectable()
export class UserService extends BusinessTemplate implements IUserService {
  constructor(
    readonly entityManager: EntityManager,
    readonly cacheService: Cache2Service,
    private readonly configService: ConfigService,
    private readonly jwt2Service: Jwt2Service,
  ) {
    super({ className: UserService.name })
  }

  async compare(currentPwd: string, userSalt: string, encryptedPwd: string) {
    const currentEncryptedPwd = await this.encryptPassword(currentPwd, userSalt)
    return currentEncryptedPwd === encryptedPwd
  }

  async encryptPassword(pwd: string, userSalt: string) {
    const { salt: APP_SALT } = this.configService.get<AppConfigType>(APP_CONFIG_KEY)!
    const HASH_SALT = wordArray(`${APP_SALT}:${userSalt}`)
    return sha256(pwd, HASH_SALT)
  }

  async create(createUserOptions: CreateUserOptions, by: string = SYSTEM_DEFAULT_BY) {
    const strategy = new CreateUserStrategy({ createUserOptions, by, encryptPassword: this.encryptPassword.bind(this) })
    return this.executionTransactionTemplateStrategy(strategy)
  }

  async delById(userIdDTO: UserIdDTO, by: string = SYSTEM_DEFAULT_BY) {
    const { superAdminName, adminName, userName } = this.configService.get<AppConfigType>(APP_CONFIG_KEY)!
    const strategy = new DelByIdUserStrategy({
      userIdDTO,
      by,
      delRedisToken: this.jwt2Service.delRedisToken.bind(this.jwt2Service),
      builtInUserNames: { superAdminName, adminName, userName },
    })
    return this.executionTransactionTemplateStrategy(strategy)
  }

  findAll(findAllDTO: FindAllDTO, isVO: true): Promise<FindAllUserVO>
  findAll(findAllDTO: FindAllDTO, isVO: false): Promise<[UserEntity[], number]>
  findAll(findAllDTO: FindAllDTO): Promise<FindAllUserVO>
  async findAll(findAllDTO: FindAllDTO, isVO: boolean = true) {
    let { limit = 10, page = 1 } = findAllDTO
    limit = +limit
    page = +page
    const skip = (page - 1) * limit
    const [data, total] = await this.entityManager.findAndCount(UserEntity, { skip, take: limit, order: { createdAt: 'DESC' } })
    return isVO ? new FindAllUserVO({ DataConstructor: UserVO, data, limit, page, total }) : [data, total]
  }

  findOneById(userIdDTO: UserIdDTO, isVO: true): Promise<UserVO>
  findOneById(userIdDTO: UserIdDTO, isVO: false): Promise<UserEntity>
  findOneById(userIdDTO: UserIdDTO): Promise<UserVO>
  async findOneById(userIdDTO: UserIdDTO, isVO: boolean = true) {
    const { id } = userIdDTO
    const user = await this.entityManager.findOne(UserEntity, { where: { id } })
    if (!user) throw new BusinessException(UserBusiness.NOT_FOUND, UserBusinessTextMap)
    return isVO ? new UserVO(user) : user
  }

  findOneByName(userNameDTO: UserNameDTO, isVO: true): Promise<UserVO>
  findOneByName(userNameDTO: UserNameDTO, isVO: false): Promise<UserEntity>
  findOneByName(userNameDTO: UserNameDTO): Promise<UserVO>
  async findOneByName(userNameDTO: UserNameDTO, isVO: boolean = true) {
    const { name } = userNameDTO
    const user = await this.entityManager.findOne(UserEntity, { where: { name } })
    if (!user) throw new BusinessException(UserBusiness.NOT_FOUND, UserBusinessTextMap)
    return isVO ? new UserVO(user) : user
  }

  async update(userIdDTO: UserIdDTO, updateUserDTO: UpdateUserDTO, by: string = SYSTEM_DEFAULT_BY) {
    const strategy = new UpdateUserStrategy({ userIdDTO, updateUserDTO, by, entityManager: this.entityManager })
    return this.executionTransactionTemplateStrategy(strategy)
  }

  async updateLoginInfo(id: string, loginAt: Date, loginIp: string) {
    return this.transactionTemplate({
      handler: async (em) => {
        await em.update(UserEntity, { id }, { loginAt, loginIp })
        return true
      },
    })
  }

  async updatePwd(id: string, pwd: string, by: string = SYSTEM_DEFAULT_BY) {
    return this.transactionTemplate({
      handler: async (em) => {
        // 新盐
        const salt = uuid_v4()
        const encryptedPwd = await this.encryptPassword(pwd, salt)
        const now = new Date()
        await em.update(UserEntity, { id }, { pwd: encryptedPwd, salt, pwdUpdateAt: now, pwdUpdateBy: by })
        return true
      },
    })
  }

  async updateStatusById(userIdDTO: UserIdDTO, updateStatusDTO: UpdateStatusDTO, by: string = SYSTEM_DEFAULT_BY) {
    const strategy = new UpdateStatusByIdStrategy({ userIdDTO, updateStatusDTO, by })
    return this.executionTransactionTemplateStrategy(strategy)
  }

  async assignRolesByIds(assignRolesByIdsDTO: AssignRolesByIdsDTO, by: string = SYSTEM_DEFAULT_BY) {
    const strategy = new AssignRolesByIdsStrategy({ assignRolesByIdsDTO, by })
    return this.executionTransactionTemplateStrategy(strategy)
  }

  async assignRolesByCodes(assignRolesByCodesDTO: AssignRolesByCodesDTO, by: string = SYSTEM_DEFAULT_BY) {
    const strategy = new AssignRolesByCodesStrategy({ assignRolesByCodesDTO, by })
    return this.executionTransactionTemplateStrategy(strategy)
  }
}
