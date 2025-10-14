import type { IResetPwdByEmailDTO } from '@packages/types'
import { CAPTCHA } from '@/common/constants'
import { ApiModel, InputCompare, InputPwd, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { CONFIRM_PWD, EMAIL, PWD, PWD_MAX, PWD_MIN } from '@/modules/system/user/user.constant'
import { LoginByEmailDTO } from './loginByEmail.dto'

@ApiModel(
  {
    email: { type: String, description: EMAIL, example: 'Aa123456@qq.com' },
    pwd: { type: String, description: PWD, example: 'Aa123456' },
    confirmPwd: { type: String, description: CONFIRM_PWD, example: 'Aa123456' },
    captcha: { type: String, description: CAPTCHA, example: '123456' },
  },
  { description: '邮箱注册接口参数校验' },
)
export class ResetPwdByEmailDTO extends LoginByEmailDTO implements IResetPwdByEmailDTO {
  @InputCompare(['pwd'])
  @NotEmpty(CONFIRM_PWD)
  @InputSpace(CONFIRM_PWD)
  @InputPwd()
  @InputStringLength(PWD_MIN, PWD_MAX, CONFIRM_PWD)
  confirmPwd: string
}
