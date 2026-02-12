import type { DataScopeEnum, IRoleDetailsVO } from '@packages/types'
import type { RoleEntity } from '../../domain'
import { ApiSchema } from '@nestjs/swagger'
import { omit } from 'lodash-es'
import { BaseVO } from '@/common/vo'

/** 角色详情 */
@ApiSchema({ description: '角色详情' })
export class RoleDetailsVO extends BaseVO implements IRoleDetailsVO {
  /**
   * 角色父节点ID
   * @example '角色父节点ID'
   */
  parentId: string | null
  /**
   * 角色名
   * @example '超级管理员'
   */
  name: string
  /**
   * 角色编码
   * @example 'SUPER'
   */
  roleCode: string
  /**
   * 数据范围(全部:10 仅本人:20 本部门:30 本部门及以下部门:40 自定义:50)
   * @example 10
   */
  dataScope: DataScopeEnum
  /**
   * 角色ID
   * @example 'xxx'
   */
  id: string
  constructor(role?: RoleEntity) {
    super()
    if (role) {
      const keys = ['_id', 'ancestorNodes', 'descendantNodes', 'users']
      const omitResult = omit(role, keys)
      Object.assign(this, omitResult)
    }
  }
}
