import type { ILoginByEmailDTO } from '@packages/types'
import { CAPTCHA, CAPTCHA_LENGTH } from '@/common/constants'
import { ApiModel, InputEmail, InputPwd, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { EMAIL, PWD, PWD_MAX, PWD_MIN } from '@/modules/system/user/user.constant'

@ApiModel(
  {
    email: { type: String, description: EMAIL, example: 'Aa123456@qq.com' },
    pwd: { type: String, description: PWD, example: 'Aa123456' },
    captcha: { type: String, description: CAPTCHA, example: '123456' },
  },
  { description: '邮箱登录接口参数校验' },
)
export class LoginByEmailDTO implements ILoginByEmailDTO {
  @NotEmpty(EMAIL)
  @InputSpace(EMAIL)
  @InputEmail()
  email: string

  @NotEmpty(PWD)
  @InputSpace(PWD)
  @InputPwd()
  @InputStringLength(PWD_MIN, PWD_MAX, PWD)
  pwd: string

  @NotEmpty(CAPTCHA)
  @InputSpace(CAPTCHA)
  @InputStringLength(CAPTCHA_LENGTH, CAPTCHA_LENGTH, CAPTCHA)
  captcha: string
}
