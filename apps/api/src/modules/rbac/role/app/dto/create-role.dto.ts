import { ApiSchema } from '@nestjs/swagger'
import { DataScopeEnum, ICreateRoleDTO } from '@packages/types'
import { IsEnum, IsOptional } from 'class-validator'
import { REMARK } from '@/common/constants'
import { InputCode, InputSpace, InputTrim, Length, NotEmpty } from '@/common/deco'
import { ROLE_CODE, ROLE_NAME, ROLE_PARENT_ID } from '../../domain'

/** 创建角色接口参数校验 */
@ApiSchema({ description: '角色名参数校验' })
export class CreateRoleDTO implements ICreateRoleDTO {
  /**
   * 角色名
   * @example '超级管理员'
   */
  @Length(2, 64, ROLE_NAME)
  @InputTrim(ROLE_NAME)
  @NotEmpty(ROLE_NAME)
  name: string

  /**
   * 角色编码
   * @example 'SUPER'
   */
  @InputCode(ROLE_CODE)
  @Length(2, 64, ROLE_CODE)
  @InputSpace(ROLE_CODE)
  @NotEmpty(ROLE_CODE)
  roleCode: string

  /**
   * 数据范围(全部:10 仅本人:20 本部门:30 本部门及以下部门:40 自定义:50)
   * @example 10
   */
  @IsEnum(DataScopeEnum, { message: '请输入正确的数据范围枚举' })
  dataScope: DataScopeEnum

  /**
   * 父节点ID
   * @example 'xxx'
   */
  @Length(36, 36, ROLE_PARENT_ID)
  @InputSpace(ROLE_PARENT_ID)
  @IsOptional()
  parentId?: string

  /**
   * 备注
   * @example 'xxx'
   */
  @Length(1, 500, REMARK)
  @InputTrim(REMARK)
  @IsOptional()
  remark?: string
}
