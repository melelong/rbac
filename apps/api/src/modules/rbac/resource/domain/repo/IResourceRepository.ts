import type { EntityManager } from 'typeorm'
import type { IResourceEntity } from '../entities'
import type { ICrudRepositoryTemplate } from '@/common/template'

/** 资源仓库接口 */
export interface IResourceRepository extends ICrudRepositoryTemplate<IResourceEntity> {
  /**
   * 根据资源编码列表查询实体
   * @param resourceCodeList 资源编码列表
   * @param relations 是否加载关联关系
   * @param em 实体管理器（可选，用于事务）
   * @returns 实体列表
   */
  findManyByCode: (resourceCodeList: string[], relations?: boolean, em?: EntityManager) => Promise<IResourceEntity[]>
  /**
   * 根据资源编码列表检查实体是否存在
   * @param resourceCodeList 资源编码列表
   * @param em 实体管理器（可选，用于事务）
   * @returns 是否存在
   */
  existsByCode: (resourceCodeList: string[], em?: EntityManager) => Promise<boolean>
}
