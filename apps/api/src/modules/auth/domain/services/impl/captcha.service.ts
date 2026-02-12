import type { ConfigObject } from 'svg-captcha'
import type { ICaptchaInfo, ICaptchaService, IEmailConfigObject, IThrottleInfo, TCaptchaName } from '../ICaptchaService'
import type { AppConfigType } from '@/config'
import { Buffer } from 'node:buffer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { create } from 'svg-captcha'
import { CAPTCHA_LENGTH } from '@/common/constants'
import { LogContextClass } from '@/common/deco'
import { BusinessException, ExceptionCode, ExceptionCodeTextMap } from '@/common/exceptions'
import { CacheService, EmailService, LoggingService } from '@/common/infra'
import { getCode, uuid_v4 } from '@/common/utils'
import { APP_CONFIG_KEY } from '@/config'
import { DEFAULT_CAPTCHA_TIMEOUT } from '../../constants'

/** 验证码服务实现 */
@Injectable()
@LogContextClass()
export class CaptchaService implements ICaptchaService {
  constructor(
    private readonly emailService: EmailService,
    private readonly loggingService: LoggingService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}

  getCaptchaKey(captchaInfo: ICaptchaInfo) {
    const { name, type, id } = captchaInfo
    return `auth:captcha:${name}:${type}:${id}`
  }

  async generateSvgCaptcha(name: TCaptchaName, configObject?: ConfigObject) {
    const background = `#${getCode(6, 16)}`
    const id = uuid_v4()
    const key = this.getCaptchaKey({ type: 'svg', name, id })
    // 生成
    const { data, text } = create({ noise: 5, size: CAPTCHA_LENGTH, background, ...configObject })
    // 缓存
    this.cacheService.set(key, text, DEFAULT_CAPTCHA_TIMEOUT).then(() => this.loggingService.debug(text))
    const svgBse64 = `data:image/svg+xml;base64,${Buffer.from(data).toString('base64')}`
    return { svg: svgBse64, token: id }
  }

  async generateEmailCaptcha(name: TCaptchaName, configObject: IEmailConfigObject) {
    const { to, subject, template } = configObject
    await this.validateThrottle({ type: 'email', name, id: to })
    const code = getCode(CAPTCHA_LENGTH, 16)
    const key = this.getCaptchaKey({ type: 'email', name, id: to })
    // 缓存
    this.cacheService.set(key, code, DEFAULT_CAPTCHA_TIMEOUT).then(() => this.loggingService.debug(code))
    const { name: APP_NAME } = this.configService.get<AppConfigType>(APP_CONFIG_KEY)!
    await this.emailService.sendEmail({ fromName: subject, to, subject, template, context: { subject, APP_NAME, code } })
    return []
  }

  async validateCaptcha(key: string, code: string) {
    const cacheCode = await this.cacheService.get<string>(key)
    if (!cacheCode) throw new BusinessException(ExceptionCode.AUTH_CODE_EXPIRED, ExceptionCodeTextMap)
    if (cacheCode.toLowerCase() !== code.toLowerCase()) throw new BusinessException(ExceptionCode.AUTH_CODE_INVALID, ExceptionCodeTextMap)
    await this.cacheService.del(key)
  }

  async validateThrottle(throttleInfo: IThrottleInfo) {
    /** 默认单个(邮箱，手机号)3分钟内只能发送2次 */
    const { id, name, type, timer = 3 * 60 * 1000, num = 2 } = throttleInfo
    const key = `auth:throttle:${name}:${type}:${id}`
    /** 没有就设置，有就更新 */
    const old = await this.cacheService.get<number>(key)
    Object.is(old, null) ? await this.cacheService.set(key, 1, timer) : await this.cacheService.update(key, +old! + 1)
    if (+old! >= num) throw new BusinessException(ExceptionCode.AUTH_CAPTCHA_TOO_FREQUENT, ExceptionCodeTextMap)
  }
}
