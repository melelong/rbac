import type { IAssignRolesResourceDTO, IIdsDTO } from '@packages/types'
import type { EntityManager } from 'typeorm'
import type { IRoleEntity } from '../../domain'
import type { IResourceEntity } from '@/modules/rbac/resource/domain'

/** 角色资源服务接口 */
export interface IRoleResourceService {
  /** 批量给角色分配资源 */
  assignRolesResourceByIds: (em: EntityManager, assignRolesResourceDTO: IAssignRolesResourceDTO, by?: string) => Promise<IRoleEntity[]>
  /** 获取多个角色ID的资源ID列表 */
  getResourceIdsByRoleIds: (roleIds: IIdsDTO, em?: EntityManager) => Promise<IRoleEntity[]>
  /** 获取多个资源ID的角色ID列表 */
  getRoleIdsByResourceIds: (resourceIds: IIdsDTO, em?: EntityManager) => Promise<IResourceEntity[]>
}
