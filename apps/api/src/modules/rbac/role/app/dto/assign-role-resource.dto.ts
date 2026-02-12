import type { IAssignRoleResourceDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { InputArray, InputSpace, Length, NotEmpty } from '@/common/deco'
import { RESOURCE_ID } from '@/modules/rbac/resource/domain'
import { RoleIdDTO } from './role-id.dto'

/** 给角色分配资源参数校验 */
@ApiSchema({ description: '给角色分配资源参数校验' })
export class AssignRoleResourceDTO extends RoleIdDTO implements IAssignRoleResourceDTO {
  /**
   * 资源ID列表
   * @example ['xxx', 'xxx']
   */
  @Length(36, 36, RESOURCE_ID, true)
  @InputSpace(RESOURCE_ID, true)
  @NotEmpty(RESOURCE_ID, true)
  @InputArray(RESOURCE_ID)
  resourceIds: string[]
}
