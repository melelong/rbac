import type { IPhoneResetPwdDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { CONFIRM_PWD } from '@/common/constants'
import { InputCompare, InputPwd, InputSpace, Length, NotEmpty } from '@/common/deco'
import { PhoneLoginDTO } from './phone-login.dto'

/** 手机号重置密码接口参数校验 */
@ApiSchema({ description: '手机号重置密码接口参数校验' })
export class PhoneResetPwdDTO extends PhoneLoginDTO implements IPhoneResetPwdDTO {
  /**
   * 确认密码
   * @example 'Aa123456'
   */
  @Length(8, 64, CONFIRM_PWD)
  @InputPwd()
  @InputCompare(['pwd'])
  @InputSpace(CONFIRM_PWD)
  @NotEmpty(CONFIRM_PWD)
  confirmPwd: string
}
