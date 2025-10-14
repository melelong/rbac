import { UUID_V4_LENGTH } from '@/common/constants'
import { ApiModel, InputArray, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { IdDTO } from '@/common/dto'
import { ROLE_CODE, ROLE_CODE_MAX, ROLE_CODE_MIN, ROLE_ID } from '@/modules/system/role/role.constant'
import { USER_ID } from '../user.constant'

@ApiModel(
  {
    id: { type: String, description: USER_ID, minLength: UUID_V4_LENGTH, maxLength: UUID_V4_LENGTH, example: 'xxx' },
    roleIds: { type: String, description: ROLE_ID, isArray: true, example: ['xxx', 'xxx'] },
  },
  { description: '通过角色ID分配角色给用户参数校验' },
)
export class AssignRolesByIdsDTO extends IdDTO {
  @InputStringLength(UUID_V4_LENGTH, UUID_V4_LENGTH, ROLE_ID, true)
  @InputSpace(ROLE_ID, true)
  @NotEmpty(ROLE_ID, true)
  @InputArray(ROLE_ID)
  roleIds: string[]
}

@ApiModel(
  {
    id: { type: String, description: USER_ID, minLength: UUID_V4_LENGTH, maxLength: UUID_V4_LENGTH, example: 'xxx' },
    roleCodes: { type: String, description: ROLE_CODE, isArray: true, example: ['xxx', 'xxx'] },
  },
  { description: '通过角色编码分配角色给用户参数校验' },
)
export class AssignRolesByCodesDTO extends IdDTO {
  @InputStringLength(ROLE_CODE_MIN, ROLE_CODE_MAX, ROLE_CODE, true)
  @InputSpace(ROLE_CODE, true)
  @NotEmpty(ROLE_CODE, true)
  @InputArray(ROLE_CODE)
  roleCodes: string[]
}
