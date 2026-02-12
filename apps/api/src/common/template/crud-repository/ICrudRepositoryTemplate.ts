import type { EntityManager, FindOptionsRelations, FindOptionsWhere, ObjectLiteral } from 'typeorm'
import type { FindAllDTO } from '@/common/dto'

/**
 * CRUD仓库模板接口
 * @description 基于TypeORM的通用CRUD操作模板接口
 */
export interface ICrudRepositoryTemplate<T extends ObjectLiteral> {
  /**
   * 批量添加实体
   * @param entityList 实体列表
   * @param by 操作人
   * @param em 实体管理器（可选，用于事务）
   */
  addMany: (entityList: T[], by?: string, em?: EntityManager) => Promise<T[]>

  /**
   * 批量根据实体列表删除实体（软删除）
   * @param entityList 实体列表
   * @param by 操作人
   * @param em 实体管理器（可选，用于事务）
   * @returns 删除结果
   */
  deleteMany: (entityList: T[], by?: string, em?: EntityManager) => Promise<boolean>

  /**
   * 批量更新实体（部分字段更新）
   * @param entityList 实体列表
   * @param by 操作人
   * @param em 实体管理器（可选，用于事务）
   * @returns 更新结果
   */
  patch: (entityList: T[], by?: string, em?: EntityManager) => Promise<boolean>

  /**
   * 根据实体ID列表查询实体
   * @param idList 实体ID列表
   * @param relations 是否加载关联关系
   * @param em 实体管理器（可选，用于事务）
   * @returns 实体列表
   */
  findManyById: (idList: string[], relations?: boolean, em?: EntityManager) => Promise<T[]>

  /**
   * 根据实体名称列表查询实体
   * @param nameList 实体名称列表
   * @param relations 是否加载关联关系
   * @param em 实体管理器（可选，用于事务）
   * @returns 实体列表
   */
  findManyByName: (nameList: string[], relations?: boolean, em?: EntityManager) => Promise<T[]>

  /** 获取默认关联关系（子类可重写） */
  getDefaultRelations: () => FindOptionsRelations<T>

  /**
   * 分页查询实体列表
   * @param findAllDTO 查询参数
   * @param relations 是否加载关联关系
   * @param em 实体管理器（可选，用于事务）
   * @returns [实体列表, 总数]
   */
  findAll: (findAllDTO: FindAllDTO, relations?: boolean, em?: EntityManager) => Promise<[T[], number]>

  /** 构建关键字查询条件（子类可重写） */
  buildKeywordWhere: (_keyword: string) => FindOptionsWhere<T>[]

  /**
   * 根据ID列表检查实体是否存在
   * @param idList 实体ID列表
   * @param em 实体管理器（可选，用于事务）
   * @returns 是否存在
   */
  existsById: (idList: string[], em?: EntityManager) => Promise<boolean>

  /**
   * 根据name列表检查实体是否存在
   * @param nameList 实体名称列表
   * @param em 实体管理器（可选，用于事务）
   * @returns 是否存在
   */
  existsByName: (nameList: string[], em?: EntityManager) => Promise<boolean>
}
