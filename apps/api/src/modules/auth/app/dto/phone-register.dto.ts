import type { IPhoneRegisterDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { InputSpace, Length, NotEmpty } from '@/common/deco'
import { USER_NAME } from '@/modules/rbac/user/domain'
import { PhoneLoginDTO } from './phone-login.dto'

/** 手机号注册接口参数校验 */
@ApiSchema({ description: '手机号注册接口参数校验' })
export class PhoneRegisterDTO extends PhoneLoginDTO implements IPhoneRegisterDTO {
  /**
   * 用户名
   * @example 'zhangsan'
   */
  @Length(2, 64, USER_NAME)
  @InputSpace(USER_NAME)
  @NotEmpty(USER_NAME)
  name: string
}
