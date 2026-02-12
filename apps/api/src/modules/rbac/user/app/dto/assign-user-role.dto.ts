import type { IAssignUserRoleDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { InputArray, InputSpace, Length, NotEmpty } from '@/common/deco'
import { ROLE_ID } from '@/modules/rbac/role/domain'
import { UserIdDTO } from './user-id.dto'

/** 给用户分配角色参数校验 */
@ApiSchema({ description: '给用户分配角色参数校验' })
export class AssignUserRoleDTO extends UserIdDTO implements IAssignUserRoleDTO {
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
