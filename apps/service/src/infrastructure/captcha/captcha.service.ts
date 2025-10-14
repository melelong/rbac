import type { ISvgCaptchaVO } from '@packages/types'
import type { ConfigObject } from 'svg-captcha'
import type {
  CaptchaName,
  CaptchaType,
  ICaptchaService,
  ICreateCaptchaKeyOptions,
  IGenerateEmailCaptchaOptions,
  IThrottleLockOptions,
} from './ICaptcha'
import type { AppConfigType } from '@/configs'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CaptchaBusiness, CaptchaBusinessTextMap } from '@packages/types'
import Redis from 'ioredis'
import { create } from 'svg-captcha'
import { CAPTCHA_LENGTH } from '@/common/constants'
import { BusinessException, SystemException } from '@/common/exceptions'
import { CacheTemplate } from '@/common/template'
import { getCode, uuid_v4 } from '@/common/utils'
import { APP_CONFIG_KEY } from '@/configs'
import { EmailService } from '@/infrastructure/email/email.service'
import { Logger2Service } from '@/infrastructure/logger2/logger2.service'
import { CAPTCHA_REDIS_CLIENT_TOKEN, SEND_EMAIL_CAPTCHA_VO } from './captcha.constant'
import { SvgCaptchaVO } from './vo/svgCaptcha.vo'

@Injectable()
export class CaptchaService extends CacheTemplate implements ICaptchaService {
  constructor(
    @Inject(CACHE_MANAGER) memory: Cache,
    @Inject(CAPTCHA_REDIS_CLIENT_TOKEN) redis: Redis,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly logger2Service: Logger2Service,
  ) {
    super({
      className: CaptchaService.name,
      redis,
      memory,
    })
  }

  createCaptchaKey(options: ICreateCaptchaKeyOptions) {
    const { name, type, id } = options
    return `${name}:${type}:${id}`
  }

  async generateSvgCaptcha(type: CaptchaType, svgCaptchaConfig?: ConfigObject): Promise<ISvgCaptchaVO> {
    const captchaName: CaptchaName = 'svg'
    const background = `#${getCode(6, 16)}`
    const token = uuid_v4()
    const key = this.createCaptchaKey({
      id: token,
      name: captchaName,
      type,
    })
    // 生成
    const { data, text } = create({
      /** 噪波线 */
      noise: 5,
      size: CAPTCHA_LENGTH,
      background,
      ...svgCaptchaConfig,
    })
    // 缓存
    this.set(key, text, 5 * 60 * 1000).then(
      () => this.logger2Service.debug(`${this.generateSvgCaptcha.name}:${key}:${text}`, CaptchaService.name),
      (error) => {
        throw new SystemException({ error })
      },
    )
    const svgBse64 = `data:image/svg+xml;base64,${Buffer.from(data).toString('base64')}`
    const VO = new SvgCaptchaVO({ token, svg: svgBse64 })
    return VO
  }

  async generateEmailCaptcha(options: IGenerateEmailCaptchaOptions) {
    const { type, to, subject, template } = options
    const captchaName: CaptchaName = 'email'
    const throttleNum = 2
    const throttleTimer = 3 * 60 * 1000
    await this.throttleLock({ type, id: to, timer: throttleTimer, num: throttleNum, name: captchaName })

    /** 生成验证码 */
    const code = getCode(CAPTCHA_LENGTH, 16)
    const key = this.createCaptchaKey({ id: to, name: captchaName, type })
    await this.set(key, code, 3 * 60 * 1000)
    this.logger2Service.debug(`${this.generateEmailCaptcha.name}:${key}:${code}`, CaptchaService.name)
    const { name: APP_NAME } = this.configService.get<AppConfigType>(APP_CONFIG_KEY)!
    await this.emailService.sendEmail({ fromName: subject, to, subject, template, context: { subject, APP_NAME, code } })
    return SEND_EMAIL_CAPTCHA_VO
  }

  async delCaptcha(options: ICreateCaptchaKeyOptions) {
    const { id, name, type } = options
    const key = this.createCaptchaKey({ id, name, type })
    await this.del(key)
  }

  async verifyCaptcha(code: string, options: ICreateCaptchaKeyOptions) {
    const { id, name, type } = options
    const key = this.createCaptchaKey({ id, name, type })
    const redisCode = await this.get(key)
    /** 找不到 */
    if (!redisCode) throw new BusinessException(CaptchaBusiness.CODE_EXPIRED, CaptchaBusinessTextMap)
    /** 对不上 */
    if (redisCode.toLowerCase() !== code.toLowerCase()) throw new BusinessException(CaptchaBusiness.CODE_INVALID, CaptchaBusinessTextMap)
    await this.delCaptcha(options)
  }

  async throttleLock(options: IThrottleLockOptions) {
    const { id, name, num, type, timer } = options
    /** 单个邮箱地址3分钟内只能发送2次 */
    // const throttleNum = 2
    // 3 * 60 * 1000
    const throttleKey = `${name}:throttle:${id}:${type}`
    /** 没有就设置，有就更新 */
    const old = await this.get<number>(throttleKey)
    Object.is(old, null) ? await this.set(throttleKey, 1, timer) : await this.update(throttleKey, +old! + 1)
    if (+old! >= num) throw new BusinessException(CaptchaBusiness.SEND_TOO_FREQUENT, CaptchaBusinessTextMap)
  }
}
