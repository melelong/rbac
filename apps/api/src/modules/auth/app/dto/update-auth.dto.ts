import type { IUpdateAuthDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { REMARK } from '@/common/constants'
import { InputTrim, Length } from '@/common/deco'
import { AUTH_NAME } from '../../domain'

/** 更新认证接口参数校验 */
@ApiSchema({ description: '更新认证接口参数校验' })
export class UpdateAuthDTO implements IUpdateAuthDTO {
  /**
   * 认证名
   * @example '认证名'
   */
  @Length(2, 64, AUTH_NAME)
  @InputTrim(AUTH_NAME)
  @IsOptional()
  name?: string

  /**
   * 备注
   * @example 'xxx'
   */
  @Length(1, 500, REMARK)
  @InputTrim(REMARK)
  @IsOptional()
  remark?: string
}
