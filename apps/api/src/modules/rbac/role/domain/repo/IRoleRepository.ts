import type { EntityManager } from 'typeorm'
import type { IRoleEntity } from '../entities'
import type { ICrudRepositoryTemplate } from '@/common/template'

/** 角色仓库接口 */
export interface IRoleRepository extends ICrudRepositoryTemplate<IRoleEntity> {
  /**
   * 根据角色编码列表查询实体
   * @param roleCodeList 角色编码列表
   * @param relations 是否加载关联关系
   * @param em 实体管理器（可选，用于事务）
   * @returns 实体列表
   */
  findManyByCode: (roleCodeList: string[], relations?: boolean, em?: EntityManager) => Promise<IRoleEntity[]>
  /**
   * 根据角色编码列表检查实体是否存在
   * @param roleCodeList 角色编码列表
   * @param em 实体管理器（可选，用于事务）
   * @returns 是否存在
   */
  existsByCode: (roleCodeList: string[], em?: EntityManager) => Promise<boolean>
}
