import type { IAssignRolesMenuDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { InputArray, InputSpace, Length, NotEmpty } from '@/common/deco'
import { MENU_ID } from '@/modules/rbac/menu/domain'
import { RoleIdsDTO } from './role-ids.dto'

/** 批量给角色分配菜单参数校验 */
@ApiSchema({ description: '批量给角色分配菜单参数校验' })
export class AssignRolesMenuDTO extends RoleIdsDTO implements IAssignRolesMenuDTO {
  /**
   * 菜单ID列表
   * @example ['xxx', 'xxx']
   */
  @Length(36, 36, MENU_ID, true)
  @InputSpace(MENU_ID, true)
  @NotEmpty(MENU_ID, true)
  @InputArray(MENU_ID)
  menuIds: string[]
}
