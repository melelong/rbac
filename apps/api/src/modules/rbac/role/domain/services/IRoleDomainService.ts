import type { TTreeNodeVO } from '@packages/types'
import type { EntityManager } from 'typeorm'
import type { CreateRoleDTO, UpdateRoleDTO } from '../../app'
import type { IRoleEntity } from '../entities'
import type { FindAllDTO, UpdateSortDTO, UpdateStatusDTO } from '@/common/dto'

/** 角色领域服务接口 */
export interface IRoleDomainService {
  /** 缓存表字段名(用于辨别修改字段属于哪个表) */
  columns: string[]
  // 基本
  /** 创建角色 */
  createRoles: (em: EntityManager, createDTOList: CreateRoleDTO[], by?: string) => Promise<IRoleEntity[]>
  /** 删除角色 */
  deleteRoles: (em: EntityManager, idList: string[], by?: string, deleteDescendant?: boolean) => Promise<boolean>
  /** 修改角色 */
  updateRoles: (em: EntityManager, idList: string[], updateDTOList: UpdateRoleDTO[], by?: string) => Promise<boolean>
  /** 修改角色状态 */
  updateRolesStatus: (em: EntityManager, idList: string[], updateStatusDTOList: UpdateStatusDTO[], by?: string) => Promise<boolean>
  /** 修改角色排序 */
  updateRolesSort: (em: EntityManager, idList: string[], UpdateSortDTOList: UpdateSortDTO[], by?: string) => Promise<boolean>
  /** 获取角色详情列表 */
  getRoles: (findAllDTO: FindAllDTO, relations: boolean, em?: EntityManager) => Promise<[IRoleEntity[], number]>
  /** 通过角色ID获取角色详情 */
  getRolesByIds: (idList: string[], relations: boolean, em?: EntityManager) => Promise<IRoleEntity[]>
  /** 通过角色名获取角色详情 */
  getRolesByNames: (nameList: string[], relations: boolean, em?: EntityManager) => Promise<IRoleEntity[]>
  // 特有的
  /** 移动角色树节点 */
  moveRoles: (em: EntityManager, idList: string[], parentIdList: (string | null)[], by?: string) => Promise<IRoleEntity[]>
  /** 获取角色树节点 */
  getRoleTreesByIds: <VO = any>(
    idList: string[],
    VOConstructor: new (...args: any[]) => VO,
    depth?: number,
    em?: EntityManager,
  ) => Promise<TTreeNodeVO<VO>[]>
  /** 通过角色编码获取角色详情 */
  getRolesByCodes: (roleCodeList: string[], relations?: boolean, em?: EntityManager) => Promise<IRoleEntity[]>
}
