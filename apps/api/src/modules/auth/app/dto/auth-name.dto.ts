import type { INameDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { InputTrim, Length, NotEmpty } from '@/common/deco'
import { AUTH_NAME } from '../../domain'

/** 认证名参数校验 */
@ApiSchema({ description: '认证名参数校验' })
export class AuthNameDTO implements INameDTO {
  /**
   * 认证名
   * @example '认证名'
   */
  @Length(2, 64, AUTH_NAME)
  @InputTrim(AUTH_NAME)
  @NotEmpty(AUTH_NAME)
  name: string
}
