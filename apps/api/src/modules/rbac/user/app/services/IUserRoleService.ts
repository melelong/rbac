import type { IAssignUsersRoleDTO, IIdsDTO } from '@packages/types'
import type { EntityManager } from 'typeorm'
import type { IUserEntity } from '../../domain'
import type { IRoleEntity } from '@/modules/rbac/role/domain'

/** 用户角色服务接口 */
export interface IUserRoleService {
  /** 批量给用户分配角色 */
  assignUsersRoleByIds: (em: EntityManager, assignUserRoleDTO: IAssignUsersRoleDTO, by?: string) => Promise<IUserEntity[]>
  /** 获取多个用户ID的角色ID列表 */
  getRoleIdsByUserId: (userIds: IIdsDTO, em?: EntityManager) => Promise<IUserEntity[]>
  /** 获取多个角色ID的用户ID列表 */
  getUserIdsByRoleIds: (roleIds: IIdsDTO, em?: EntityManager) => Promise<IRoleEntity[]>
}
