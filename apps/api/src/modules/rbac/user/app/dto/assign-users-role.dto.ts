import type { IAssignUsersRoleDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { InputArray, InputSpace, Length, NotEmpty } from '@/common/deco'
import { ROLE_ID } from '@/modules/rbac/role/domain'
import { UserIdsDTO } from './user-ids.dto'

/** 批量给用户分配角色参数校验 */
@ApiSchema({ description: '批量给用户分配角色参数校验' })
export class AssignUsersRoleDTO extends UserIdsDTO implements IAssignUsersRoleDTO {
  /**
   * 角色ID列表
   * @example ['xxx', 'xxx']
   */
  @Length(36, 36, ROLE_ID, true)
  @InputSpace(ROLE_ID, true)
  @NotEmpty(ROLE_ID, true)
  @InputArray(ROLE_ID)
  roleIds: string[]
}
