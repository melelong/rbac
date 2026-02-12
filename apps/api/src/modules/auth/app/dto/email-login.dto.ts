import type { IEmailLoginDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { CAPTCHA, EMAIL, PWD } from '@/common/constants'
import { InputEmail, InputPwd, InputSpace, Length, NotEmpty } from '@/common/deco'

/** 邮箱登录接口参数校验 */
@ApiSchema({ description: '邮箱登录接口参数校验' })
export class EmailLoginDTO implements IEmailLoginDTO {
  /**
   * 邮箱
   * @example 'zhangsan@example.com'
   */
  @Length(2, 191, EMAIL)
  @InputEmail()
  @InputSpace(EMAIL)
  @NotEmpty(EMAIL)
  email: string

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
