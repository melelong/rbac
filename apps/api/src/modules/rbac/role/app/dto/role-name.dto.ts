import type { INameDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { InputTrim, Length, NotEmpty } from '@/common/deco'
import { ROLE_NAME } from '../../domain'

/** 角色名参数校验 */
@ApiSchema({ description: '角色名参数校验' })
export class RoleNameDTO implements INameDTO {
  /**
   * 角色名
   * @example '角色名'
   */
  @Length(2, 64, ROLE_NAME)
  @InputTrim(ROLE_NAME)
  @NotEmpty(ROLE_NAME)
  name: string
}
