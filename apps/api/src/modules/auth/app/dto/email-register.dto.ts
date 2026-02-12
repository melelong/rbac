import type { IEmailRegisterDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { InputSpace, Length, NotEmpty } from '@/common/deco'
import { USER_NAME } from '@/modules/rbac/user/domain'
import { EmailLoginDTO } from './email-login.dto'

/** 邮箱注册接口参数校验 */
@ApiSchema({ description: '邮箱注册接口参数校验' })
export class EmailRegisterDTO extends EmailLoginDTO implements IEmailRegisterDTO {
  /**
   * 用户名
   * @example 'zhangsan'
   */
  @Length(2, 64, USER_NAME)
  @InputSpace(USER_NAME)
  @NotEmpty(USER_NAME)
  name: string
}
