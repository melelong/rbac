import type { EntityManager } from 'typeorm'
import type { IUserEntity } from '../entities'
import type { ICrudRepositoryTemplate } from '@/common/template'

/** 用户仓库接口 */
export interface IUserRepository extends ICrudRepositoryTemplate<IUserEntity> {
  /**
   * 根据邮箱列表查询实体
   * @param emailList 邮箱列表
   * @param relations 是否加载关联关系
   * @param em 实体管理器（可选，用于事务）
   * @returns 实体列表
   */
  findManyByEmail: (emailList: string[], relations?: boolean, em?: EntityManager) => Promise<IUserEntity[]>
  /**
   * 根据电话号码列表查询实体
   * @param phoneList 电话号码列表
   * @param relations 是否加载关联关系
   * @param em 实体管理器（可选，用于事务）
   * @returns 实体列表
   */
  findManyByPhone: (phoneList: string[], relations?: boolean, em?: EntityManager) => Promise<IUserEntity[]>
  /**
   * 根据邮箱列表检查实体是否存在
   * @param emailList 邮箱列表
   * @param em 实体管理器（可选，用于事务）
   * @returns 是否存在
   */
  existsByEmail: (emailList: string[], em?: EntityManager) => Promise<boolean>
  /**
   * 根据电话号码列表检查实体是否存在
   * @param phoneList 电话号码列表
   * @param em 实体管理器（可选，用于事务）
   * @returns 是否存在
   */
  existsByPhone: (phoneList: string[], em?: EntityManager) => Promise<boolean>
}
