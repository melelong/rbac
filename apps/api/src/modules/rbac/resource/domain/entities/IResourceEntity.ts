import type { ResourceTypeEnum } from '@packages/types'
import type { ICommonEntity } from '@/common/entities'
import type { IRoleEntity } from '@/modules/rbac/role/domain'
/** 资源表实体接口 */
export interface IResourceEntity extends ICommonEntity {
  /** 资源名 */
  name: string
  /** 资源编码(资源类型:领域:方法) */
  resourceCode: string
  /** 资源类型 */
  resourceType: ResourceTypeEnum
  /** 领域 */
  domain: string
  /** 方法 */
  method: string
  /** 资源N-N角色 */
  roles: IRoleEntity[]
}
