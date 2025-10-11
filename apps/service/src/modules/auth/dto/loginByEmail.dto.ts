import type { ILoginByEmailDTO } from '@packages/types'
import { CAPTCHA, CAPTCHA_LENGTH } from '@/common/constants'
import { ApiModel, InputEmail, InputPwd, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { EMAIL, PWD, PWD_MAX, PWD_MIN, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '@/modules/system/user/user.constant'

@ApiModel(
  {
    name: { type: String, description: USER_NAME, example: 'admin' },
    pwd: { type: String, description: PWD, example: 'Aa123456' },
    email: { type: String, description: EMAIL, example: 'Aa123456@qq.com' },
    captcha: { type: String, description: CAPTCHA, example: '123456' },
  },
  { description: '邮箱登录接口参数校验' },
)
export class LoginByEmailDTO implements ILoginByEmailDTO {
  @NotEmpty(USER_NAME)
  @InputSpace(USER_NAME)
  @InputStringLength(USER_NAME_MIN, USER_NAME_MAX, USER_NAME)
  name: string

  @NotEmpty(PWD)
  @InputSpace(PWD)
  @InputPwd()
  @InputStringLength(PWD_MIN, PWD_MAX, PWD)
  pwd: string

  @NotEmpty(EMAIL)
  @InputSpace(EMAIL)
  @InputEmail()
  email: string

  @NotEmpty(CAPTCHA)
  @InputSpace(CAPTCHA)
  @InputStringLength(CAPTCHA_LENGTH, CAPTCHA_LENGTH, CAPTCHA)
  captcha: string
}
