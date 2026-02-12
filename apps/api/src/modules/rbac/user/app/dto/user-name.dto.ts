import type { INameDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { InputTrim, Length, NotEmpty } from '@/common/deco'
import { USER_NAME } from '../../domain'

/** 用户名参数校验 */
@ApiSchema({ description: '用户名参数校验' })
export class UserNameDTO implements INameDTO {
  /**
   * 用户名
   * @example '用户名'
   */
  @Length(2, 64, USER_NAME)
  @InputTrim(USER_NAME)
  @NotEmpty(USER_NAME)
  name: string
}
