import type { ISvgLoginDTO } from '@packages/types'
import { CAPTCHA, CAPTCHA_TOKEN, PWD } from '@/common/constants'
import { InputPwd, InputSpace, Length, NotEmpty } from '@/common/deco'
import { USER_NAME } from '@/modules/rbac/user/domain'

export class SvgLoginDTO implements ISvgLoginDTO {
  /**
   * 用户名
   * @example 'zhangsan'
   */
  @Length(2, 64, USER_NAME)
  @InputSpace(USER_NAME)
  @NotEmpty(USER_NAME)
  name: string

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
   * 验证码令牌
   * @example 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
   */
  @Length(36, 36, CAPTCHA_TOKEN)
  @InputSpace(CAPTCHA_TOKEN)
  @NotEmpty(CAPTCHA_TOKEN)
  token: string

  /**
   * 验证码
   * @example '123456'
   */
  @Length(6, 6, CAPTCHA)
  @InputSpace(CAPTCHA)
  @NotEmpty(CAPTCHA)
  captcha: string
}
