import type { RoleEntity } from '../entities/role.entity'
import { IRoleVO, StatusEnum } from '@packages/types'
import { ApiModel } from '@/common/decorators'
import { DeptVO } from '@/modules/system/dept/vo'
import { PermissionVO } from '@/modules/system/permission/vo'
import { RoleTreeEntity } from '../entities/roleTree.entity'

@ApiModel(
  {
    id: { type: String, description: '业务ID', example: 'xxx' },
    createdBy: { type: String, description: '创建者', example: 'xxx' },
    updatedBy: { type: String, description: '更新者', example: 'xxx' },
    createdAt: { type: Date, description: '创建时间', example: 'xxx' },
    updatedAt: { type: Date, description: '更新时间', example: 'xxx' },
    remark: { type: String, description: '备注', example: 'xxx' },
    status: { enum: StatusEnum, description: '状态(未知:10 启用:20 禁用:30)', example: StatusEnum.ENABLE },
    parentId: { type: String, description: '父角色ID', example: 'xxx' },
    name: { type: String, description: '角色名', example: '超级管理员' },
    roleCode: { type: String, description: '角色编码', example: 'SUPER' },
    permissions: { type: PermissionVO, description: '拥有权限列表', isArray: true },
    depts: { type: DeptVO, description: '拥有部门列表', isArray: true },
  },
  { description: '角色详情' },
)
export class RoleVO implements IRoleVO {
  id: string
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
  remark: string | null
  status: StatusEnum
  parentId: string | null
  name: string
  roleCode: string
  permissions: PermissionVO[]
  depts: DeptVO[]
  ancestorNodes: RoleTreeEntity[]
  descendantNodes: RoleTreeEntity[]

  constructor(role?: RoleEntity) {
    if (role) {
      const {
        id,
        createdBy,
        updatedBy,
        createdAt,
        updatedAt,
        remark,
        status,
        parentId,
        name,
        roleCode,
        permissions,
        depts,
        ancestorNodes,
        descendantNodes,
      } = role
      this.id = id
      this.createdBy = createdBy
      this.updatedBy = updatedBy
      this.createdAt = createdAt
      this.updatedAt = updatedAt
      this.remark = remark
      this.status = status
      this.parentId = parentId
      this.name = name
      this.roleCode = roleCode
      this.permissions = permissions ? permissions.map((permission) => new PermissionVO(permission)) : []
      this.depts = depts ? depts.map((dept) => new DeptVO(dept)) : []
      this.ancestorNodes = ancestorNodes
      this.descendantNodes = descendantNodes
    }
  }
}
