import type { IPhoneCaptchaDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { IsPhoneNumber } from 'class-validator'
import { PHONE } from '@/common/constants'
import { NotEmpty } from '@/common/deco'

/** 手机号验证码接口参数校验 */
@ApiSchema({ description: '手机号验证码接口参数校验' })
export class PhoneCaptchaDTO implements IPhoneCaptchaDTO {
  /**
   * 手机号
   * @example '13800000000'
   */
  @IsPhoneNumber('CN', { message: '请输入正确的手机号格式' })
  @NotEmpty(PHONE)
  phone: string
}
