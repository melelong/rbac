import type { ICreateAuthDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { REMARK } from '@/common/constants'
import { InputTrim, Length, NotEmpty } from '@/common/deco'
import { AUTH_NAME } from '../../domain'

/** 创建认证接口参数校验 */
@ApiSchema({ description: '认证名参数校验' })
export class CreateAuthDTO implements ICreateAuthDTO {
  /**
   * 认证名
   * @example '认证名'
   */
  @Length(2, 64, AUTH_NAME)
  @InputTrim(AUTH_NAME)
  @NotEmpty(AUTH_NAME)
  name: string

  /**
   * 备注
   * @example 'xxx'
   */
  @Length(1, 500, REMARK)
  @InputTrim(REMARK)
  @IsOptional()
  remark?: string
}
