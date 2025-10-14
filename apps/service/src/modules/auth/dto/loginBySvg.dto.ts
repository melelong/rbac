import type { ILoginBySvgDTO } from '@packages/types'
import { CAPTCHA, CAPTCHA_LENGTH, CAPTCHA_TOKEN, CAPTCHA_TOKEN_LENGTH } from '@/common/constants'
import { ApiModel, InputPwd, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { PWD, PWD_MAX, PWD_MIN, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '@/modules/system/user/user.constant'

@ApiModel(
  {
    name: { type: String, description: USER_NAME, example: 'admin' },
    pwd: { type: String, description: PWD, example: 'Aa123456' },
    captcha: { type: String, description: CAPTCHA, example: '123456' },
    token: { type: String, description: CAPTCHA_TOKEN, example: 'xxx' },
  },
  { description: '邮箱登录接口参数校验' },
)
export class LoginBySvgDTO implements ILoginBySvgDTO {
  @InputStringLength(USER_NAME_MIN, USER_NAME_MAX, USER_NAME)
  @InputSpace(USER_NAME)
  @NotEmpty(USER_NAME)
  name: string

  @InputStringLength(PWD_MIN, PWD_MAX, PWD)
  @InputPwd()
  @InputSpace(PWD)
  @NotEmpty(PWD)
  pwd: string

  @InputStringLength(CAPTCHA_LENGTH, CAPTCHA_LENGTH, CAPTCHA)
  @InputSpace(CAPTCHA)
  @NotEmpty(CAPTCHA)
  captcha: string

  @InputStringLength(CAPTCHA_TOKEN_LENGTH, CAPTCHA_TOKEN_LENGTH, CAPTCHA_TOKEN)
  @InputSpace(CAPTCHA_TOKEN)
  @NotEmpty(CAPTCHA_TOKEN)
  token: string
}
