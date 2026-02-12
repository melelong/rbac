import type { IEmailCaptchaDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { EMAIL } from '@/common/constants'
import { InputEmail, InputSpace, Length, NotEmpty } from '@/common/deco'

/** 邮箱验证码接口参数校验 */
@ApiSchema({ description: '邮箱验证码接口参数校验' })
export class EmailCaptchaDTO implements IEmailCaptchaDTO {
  /**
   * 邮箱
   * @example 'zhangsan@example.com'
   */
  @Length(2, 191, EMAIL)
  @InputEmail()
  @InputSpace(EMAIL)
  @NotEmpty(EMAIL)
  email: string
}
