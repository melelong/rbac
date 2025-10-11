import type { IEmailCaptchaDTO } from '@packages/types'
import { ApiModel, InputEmail, InputSpace, NotEmpty } from '@/common/decorators'
import { EMAIL } from '@/modules/system/user/user.constant'

@ApiModel(
  {
    email: { type: String, description: EMAIL, example: 'Aa123456@qq.com' },
  },
  { description: '邮箱验证码接口参数校验' },
)
export class EmailCaptchaDTO implements IEmailCaptchaDTO {
  @InputEmail()
  @InputSpace(EMAIL)
  @NotEmpty(EMAIL)
  email: string
}
