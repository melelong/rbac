import { UUID_V4_LENGTH } from '@/common/constants'
import { ApiModel, InputArray, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { IdDTO } from '@/common/dto'
import { PERMISSION_CODE, PERMISSION_CODE_MAX, PERMISSION_CODE_MIN, PERMISSION_ID } from '@/modules/system/permission/permission.constant'
import { ROLE_ID } from '@/modules/system/role/role.constant'

@ApiModel(
  {
    id: { type: String, description: ROLE_ID, minLength: UUID_V4_LENGTH, maxLength: UUID_V4_LENGTH, example: 'xxx' },
    permissionIds: { type: String, description: PERMISSION_ID, isArray: true, example: ['xxx', 'xxx'] },
  },
  { description: '通过权限ID分配权限给角色参数校验' },
)
export class AssignPermissionsByIdsDTO extends IdDTO {
  @InputStringLength(UUID_V4_LENGTH, UUID_V4_LENGTH, PERMISSION_ID, true)
  @InputSpace(PERMISSION_ID, true)
  @NotEmpty(PERMISSION_ID, true)
  @InputArray(PERMISSION_ID)
  permissionIds: string[]
}

@ApiModel(
  {
    id: { type: String, description: ROLE_ID, minLength: UUID_V4_LENGTH, maxLength: UUID_V4_LENGTH, example: 'xxx' },
    permissionCodes: { type: String, description: PERMISSION_CODE, isArray: true, example: ['xxx', 'xxx'] },
  },
  { description: '通过权限编码分配权限给角色参数校验' },
)
export class AssignPermissionsByCodesDTO extends IdDTO {
  @InputStringLength(PERMISSION_CODE_MIN, PERMISSION_CODE_MAX, PERMISSION_CODE, true)
  @InputSpace(PERMISSION_CODE, true)
  @NotEmpty(PERMISSION_CODE, true)
  @InputArray(PERMISSION_CODE)
  permissionCodes: string[]
}
