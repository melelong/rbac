import type { ITokenVO } from '@packages/types'
import type { Response } from 'express'
import type { CreateAuthDTO, UpdateAuthDTO } from '../../../app'
import type { IAuthDomainService } from '../IAuthDomainService'
import type { ITokenInfo } from '../ITokenService'
import type { FindAllDTO, UpdateSortDTO, UpdateStatusDTO } from '@/common/dto'
import type { IJwtConfig } from '@/config'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { isUndefined } from 'lodash-es'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextClass } from '@/common/deco'
import { BusinessException, ExceptionCode, ExceptionCodeTextMap } from '@/common/exceptions'
import { CacheService, LoggingService, REQ_CTX } from '@/common/infra'
import { uuid_v4 } from '@/common/utils'
import { JWT_CONFIG_KEY } from '@/config'
import { AuthRepository } from '../../../infra/repo'
import { AuthEntity } from '../../entities'
import { AuthValidateService } from './auth-validate.service'
import { TokenService } from './token.service'

/** 认证领域服务实现 */
@Injectable()
@LogContextClass()
export class AuthDomainService implements IAuthDomainService {
  columns: string[]
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly validateService: AuthValidateService,
    private readonly configService: ConfigService,
    private readonly clsService: ClsService,
    private readonly tokenService: TokenService,
    private readonly cacheService: CacheService,
    private readonly loggingService: LoggingService,
  ) {
    // 获取表字段名
    this.columns = this.authRepo.metadata.columns.map((c) => c.propertyName)
  }

  async resetPwd(res: Response) {
    const userId = this.clsService.get<string>(REQ_CTX.USER_ID)
    const accessInfo = this.clsService.get<ITokenInfo>(REQ_CTX.ACCESS_INFO)
    const accessToken = this.clsService.get<string>(REQ_CTX.ACCESS_TOKEN)
    const { refreshTokenCookieExpiresIn, accessTokenCookieExpiresIn } = this.configService.get<IJwtConfig>(JWT_CONFIG_KEY)!
    const doResetPwd = async () => {
      const oldRefreshToken = await this.tokenService.getRefreshCache(userId)
      let oldRefreshInfo: ITokenInfo | null = null
      if (oldRefreshToken) {
        try {
          oldRefreshInfo = await this.tokenService.verifyToken(oldRefreshToken)
        } catch {
          // 过期或无效，忽略
        }
      }
      if (oldRefreshInfo) {
        await Promise.all([
          this.tokenService.setBlackListCache(oldRefreshInfo, oldRefreshToken!, refreshTokenCookieExpiresIn),
          this.tokenService.delRefreshCache(userId),
        ]).catch((err) => {
          this.loggingService.error(`拉黑刷新令牌失败:${err.message}`, err.trace)
        })
      }
      const isCurrentUser = userId === accessInfo?.sub
      if (isCurrentUser) {
        await Promise.all([
          accessInfo ? this.tokenService.setBlackListCache(accessInfo, accessToken!, accessTokenCookieExpiresIn) : null,
          this.tokenService.delCookieToken({ key: 'refresh', res, maxAge: 0 }),
          this.tokenService.delCookieToken({ key: 'Authorization', res, maxAge: 0 }),
          this.tokenService.delCookieToken({ key: 'authorization', res, maxAge: 0 }),
        ])
      }
      return true
    }
    return this.cacheService.withLock(`resetPwd:${userId}`, doResetPwd, { expiration: 10000, retryCount: 2, retryDelay: 100 })
  }

  async login(res: Response) {
    const userId = this.clsService.get<string>(REQ_CTX.USER_ID)
    const { refreshTokenCookieExpiresIn, accessTokenCookieExpiresIn } = this.configService.get<IJwtConfig>(JWT_CONFIG_KEY)!
    const doLogin = async () => {
      const [newAccessToken, newRefreshToken, oldRefreshToken] = await Promise.all([
        this.tokenService.generateToken({ sub: userId, type: 'access', jti: uuid_v4() }, accessTokenCookieExpiresIn),
        this.tokenService.generateToken({ sub: userId, type: 'refresh', jti: uuid_v4() }, refreshTokenCookieExpiresIn),
        this.tokenService.getRefreshCache(userId),
      ])
      let oldRefreshInfo: ITokenInfo | null = null
      if (oldRefreshToken) {
        try {
          oldRefreshInfo = await this.tokenService.verifyToken(oldRefreshToken)
        } catch {
          // 过期或无效，忽略
        }
      }
      await Promise.all([
        this.tokenService.setRefreshCache(userId, newRefreshToken),
        this.tokenService.setCookieToken({ key: 'refresh', value: newRefreshToken, res }),
        oldRefreshInfo ? this.tokenService.setBlackListCache(oldRefreshInfo, oldRefreshToken!, refreshTokenCookieExpiresIn) : null,
      ])
      return { accessToken: newAccessToken, refreshToken: newRefreshToken } as ITokenVO
    }
    return this.cacheService.withLock(`login:${userId}`, doLogin, { expiration: 10000, retryCount: 2, retryDelay: 100 })
  }

  async logout(res: Response) {
    const userId = this.clsService.get<string>(REQ_CTX.USER_ID)
    const accessInfo = this.clsService.get<ITokenInfo>(REQ_CTX.ACCESS_INFO)
    const accessToken = this.clsService.get<string>(REQ_CTX.ACCESS_TOKEN)
    const refreshInfo = this.clsService.get<ITokenInfo>(REQ_CTX.REFRESH_INFO)
    const refreshToken = this.clsService.get<string>(REQ_CTX.REFRESH_TOKEN)
    const { refreshTokenCookieExpiresIn, accessTokenCookieExpiresIn } = this.configService.get<IJwtConfig>(JWT_CONFIG_KEY)!
    // 拉黑令牌
    await Promise.all([
      this.tokenService.setBlackListCache(refreshInfo, refreshToken, refreshTokenCookieExpiresIn),
      accessInfo ? this.tokenService.setBlackListCache(accessInfo, accessToken!, accessTokenCookieExpiresIn) : null,
    ]).catch((err) => {
      this.loggingService.error(`拉黑令牌失败:${err.message}`, err.trace)
    })
    // 删除令牌缓存
    await Promise.all([
      this.tokenService.delRefreshCache(userId),
      this.tokenService.delCookieToken({ key: 'refresh', res, maxAge: 0 }),
      this.tokenService.delCookieToken({ key: 'Authorization', res, maxAge: 0 }),
      this.tokenService.delCookieToken({ key: 'authorization', res, maxAge: 0 }),
    ])
    return true
  }

  async refreshToken(res: Response) {
    const userId = this.clsService.get<string>(REQ_CTX.USER_ID)
    const accessInfo = this.clsService.get<ITokenInfo>(REQ_CTX.ACCESS_INFO)
    const accessToken = this.clsService.get<string>(REQ_CTX.ACCESS_TOKEN)
    const refreshInfo = this.clsService.get<ITokenInfo>(REQ_CTX.REFRESH_INFO)
    const refreshToken = this.clsService.get<string>(REQ_CTX.REFRESH_TOKEN)
    const { refreshTokenCookieExpiresIn, accessTokenCookieExpiresIn } = this.configService.get<IJwtConfig>(JWT_CONFIG_KEY)!
    const doRefresh = async () => {
      // 拉黑令牌
      await Promise.all([
        this.tokenService.delaySetBlackListCache(refreshInfo, refreshToken, refreshTokenCookieExpiresIn),
        accessInfo ? this.tokenService.delaySetBlackListCache(accessInfo, accessToken!, accessTokenCookieExpiresIn) : null,
      ]).catch((err) => {
        this.loggingService.error(`拉黑令牌失败:${err.message}`, err.trace)
      })
      // 生成新令牌
      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.tokenService.generateToken({ sub: userId, type: 'access', jti: uuid_v4() }, accessTokenCookieExpiresIn),
        this.tokenService.generateToken({ sub: userId, type: 'refresh', jti: uuid_v4() }, refreshTokenCookieExpiresIn),
      ])
      await Promise.all([
        this.tokenService.setRefreshCache(userId, newRefreshToken),
        this.tokenService.setCookieToken({ key: 'refresh', value: newRefreshToken, res }),
      ])
      return { accessToken: newAccessToken, refreshToken: newRefreshToken } as ITokenVO
    }
    return this.cacheService.withLock(`refresh:${refreshInfo.jti}`, doRefresh, { expiration: 10000, retryCount: 2, retryDelay: 100 })
  }

  async createAuths(em: EntityManager, createDTOList: CreateAuthDTO[], by: string = SYSTEM_DEFAULT_BY) {
    const nameList: string[] = []
    const createList: AuthEntity[] = []
    const now = new Date()
    const base = { createdBy: by, createdAt: now, updatedBy: by, updatedAt: now }
    for (let i = 0, len = createDTOList.length; i < len; i++) {
      const { name } = createDTOList[i]
      nameList.push(name)
      // 认证
      const id = uuid_v4()
      createList.push(em.create(AuthEntity, { id, ...createDTOList[i], ...base }))
    }
    await Promise.all([this.validateService.validateName(nameList, false, em)])
    const auths = await this.authRepo.addMany(createList, by, em)
    return auths
  }

  async deleteAuths(em: EntityManager, idList: string[], by: string = SYSTEM_DEFAULT_BY) {
    const auths = await this.getAuthsByIds(idList, false, em)
    // 删除认证
    await Promise.all([this.authRepo.deleteMany(auths, by, em)])
    return true
  }

  async updateAuths(em: EntityManager, idList: string[], updateDTOList: UpdateAuthDTO[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== updateDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const auths = await this.getAuthsByIds(idList, false, em)
    const nameList: string[] = []
    for (let i = 0, len = auths.length; i < len; i++) {
      const DTO = updateDTOList[i]
      const auth = auths[i]
      const { name, remark } = DTO
      if (name) nameList.push(name)
      // 与表字段名对比
      let hasData = false
      for (const [k, v] of Object.entries(DTO)) {
        if (isUndefined(v)) continue
        hasData = true
        if (this.columns.includes(k)) (auth as any)[k] = v
      }
      if (remark) auth.remark = remark
      // 没有修改数据
      if (!hasData) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    }
    await Promise.all([nameList.length > 0 ? this.validateService.validateName(nameList, false, em) : null])
    await Promise.all([this.authRepo.patch(auths, by, em)])
    return true
  }

  async updateAuthsStatus(em: EntityManager, idList: string[], updateStatusDTOList: UpdateStatusDTO[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== updateStatusDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const auths = await this.getAuthsByIds(idList, false, em)
    for (let i = 0, len = auths.length; i < len; i++) {
      const updateStatusDTO = updateStatusDTOList[i]
      const auth = auths[i]
      auth.status = updateStatusDTO.status
    }
    await Promise.all([this.authRepo.patch(auths, by, em)])
    return true
  }

  async updateAuthsSort(em: EntityManager, idList: string[], updateSortDTOList: UpdateSortDTO[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== updateSortDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const auths = await this.getAuthsByIds(idList, false, em)
    for (let i = 0, len = auths.length; i < len; i++) {
      const updateSortDTO = updateSortDTOList[i]
      const auth = auths[i]
      auth.sort = updateSortDTO.sort
    }
    await Promise.all([this.authRepo.patch(auths, by, em)])
    return true
  }

  async getAuths(findAllDTO: FindAllDTO, relations: boolean = false, em?: EntityManager) {
    return this.authRepo.findAll(findAllDTO, relations, em)
  }

  async getAuthsByIds(idList: string[], relations: boolean = false, em?: EntityManager) {
    const auths = await this.authRepo.findManyById(idList, relations, em)
    if (idList.length !== auths.length) throw new BusinessException(ExceptionCode.AUTH_NOT_FOUND, ExceptionCodeTextMap)
    return auths
  }

  async getAuthsByNames(nameList: string[], relations: boolean = false, em?: EntityManager) {
    const auths = await this.authRepo.findManyByName(nameList, relations, em)
    if (nameList.length !== auths.length) throw new BusinessException(ExceptionCode.AUTH_NOT_FOUND, ExceptionCodeTextMap)
    return auths
  }
}
