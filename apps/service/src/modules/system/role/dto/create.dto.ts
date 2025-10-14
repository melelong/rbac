import type { ICreateRoleDTO } from '@packages/types'
import { IsOptional } from 'class-validator'
import { REMARK, REMARK_MAX, REMARK_MIN, UUID_V4_LENGTH } from '@/common/constants'
import { ApiModel, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { ROLE_CODE, ROLE_CODE_MAX, ROLE_CODE_MIN, ROLE_NAME, ROLE_NAME_MAX, ROLE_NAME_MIN, ROLE_PARENT_ID } from '../role.constant'

@ApiModel(
  {
    name: { type: String, description: ROLE_NAME, minLength: ROLE_NAME_MIN, maxLength: ROLE_NAME_MAX, example: '超级管理员' },
    roleCode: { type: String, description: ROLE_CODE, minLength: ROLE_CODE_MIN, maxLength: ROLE_CODE_MAX, example: 'SUPER' },
    parentId: {
      type: String,
      description: ROLE_PARENT_ID,
      minLength: UUID_V4_LENGTH,
      maxLength: UUID_V4_LENGTH,
      example: ROLE_PARENT_ID,
      required: false,
    },
    remark: { type: String, description: REMARK, minLength: REMARK_MIN, maxLength: REMARK_MAX, example: 'xxx', required: false },
  },
  { description: '创建角色接口参数校验' },
)
export class CreateRoleDTO implements ICreateRoleDTO {
  @InputStringLength(ROLE_NAME_MIN, ROLE_NAME_MAX, ROLE_NAME)
  @InputSpace(ROLE_NAME)
  @NotEmpty(ROLE_NAME)
  name: string

  @InputStringLength(ROLE_CODE_MIN, ROLE_CODE_MAX, ROLE_CODE)
  @InputSpace(ROLE_CODE)
  @NotEmpty(ROLE_CODE)
  roleCode: string

  @InputStringLength(UUID_V4_LENGTH, UUID_V4_LENGTH, ROLE_PARENT_ID)
  @InputSpace(ROLE_PARENT_ID)
  @IsOptional()
  parentId?: string

  @InputStringLength(REMARK_MIN, REMARK_MAX, REMARK)
  @InputSpace(REMARK)
  @IsOptional()
  remark?: string
}
