import type { DataScopeEnum } from '@packages/types'
import type { IRoleTreeEntity } from './IRoleTreeEntity'
import type { ICommonEntity } from '@/common/entities'
import type { IMenuEntity } from '@/modules/rbac/menu/domain'
import type { IResourceEntity } from '@/modules/rbac/resource/domain'
import type { IUserEntity } from '@/modules/rbac/user/domain'
/** 角色表实体接口 */
export interface IRoleEntity extends ICommonEntity {
  /** 角色名 */
  name: string
  /** 父角色ID */
  parentId: string | null
  /** 角色编码 */
  roleCode: string
  /** 数据范围 */
  dataScope: DataScopeEnum
  /** 角色N-N用户 */
  users: IUserEntity[]
  /** 角色N-N部门 */
  // depts: IDeptEntity[]
  /** 角色N-N资源 */
  resources: IResourceEntity[]
  /** 角色N-N菜单 */
  menus: IMenuEntity[]
  /** 角色N-1角色树(所有祖先路径) */
  ancestorNodes: IRoleTreeEntity[]
  /** 角色N-1角色树(所有后代路径) */
  descendantNodes: IRoleTreeEntity[]
}
