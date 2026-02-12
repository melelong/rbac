import type { IUpdateRoleDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { DataScopeEnum } from '@packages/types'
import { IsEnum, IsOptional } from 'class-validator'
import { REMARK } from '@/common/constants'
import { InputCode, InputSpace, InputTrim, Length } from '@/common/deco'
import { ROLE_CODE, ROLE_NAME } from '../../domain'

/** 更新角色接口参数校验 */
@ApiSchema({ description: '更新角色接口参数校验' })
export class UpdateRoleDTO implements IUpdateRoleDTO {
  /**
   * 角色名
   * @example '角色名'
   */
  @Length(2, 64, ROLE_NAME)
  @InputTrim(ROLE_NAME)
  @IsOptional()
  name?: string

  /**
   * 角色编码
   * @example 'SUPER'
   */
  @InputCode(ROLE_CODE)
  @Length(2, 64, ROLE_CODE)
  @InputSpace(ROLE_CODE)
  @IsOptional()
  roleCode?: string

  /**
   * 数据范围(全部:10 仅本人:20 本部门:30 本部门及以下部门:40 自定义:50)
   * @example 10
   */
  @IsEnum(DataScopeEnum, { message: '请输入正确的数据范围枚举' })
  @IsOptional()
  dataScope?: DataScopeEnum

  /**
   * 备注
   * @example 'xxx'
   */
  @Length(1, 500, REMARK)
  @InputTrim(REMARK)
  @IsOptional()
  remark?: string
}
