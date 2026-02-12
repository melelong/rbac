import type { IPhoneLoginDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { IsPhoneNumber } from 'class-validator'
import { CAPTCHA, PHONE, PWD } from '@/common/constants'
import { InputPwd, InputSpace, Length, NotEmpty } from '@/common/deco'

/** 手机号登录接口参数校验 */
@ApiSchema({ description: '手机号登录接口参数校验' })
export class PhoneLoginDTO implements IPhoneLoginDTO {
  /**
   * 手机号
   * @example 'zhangsan@example.com'
   */
  @IsPhoneNumber('CN', { message: '请输入正确的手机号格式' })
  @NotEmpty(PHONE)
  phone: string

  /**
   * 密码
   * @example 'Aa123456'
   */
  @Length(8, 64, PWD)
  @InputPwd()
  @InputSpace(PWD)
  @NotEmpty(PWD)
  pwd: string

  /**
   * 验证码
   * @example '123456'
   */
  @Length(6, 6, CAPTCHA)
  @InputSpace(CAPTCHA)
  @NotEmpty(CAPTCHA)
  captcha: string
}
