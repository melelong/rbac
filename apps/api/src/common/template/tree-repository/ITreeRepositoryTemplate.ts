import type { TTreeNodeVO } from '@packages/types'
import type { EntityManager, FindOptionsWhere, ObjectLiteral } from 'typeorm'
/**
 * Tree仓库模板接口
 * @description 基于TypeORM的通用Tree操作模板接口
 */
export interface ITreeRepositoryTemplate<T extends ObjectLiteral> {
  /**
   * 批量添加树实体
   * @param treeEntityList 树实体列表
   * @param em 实体管理器（可选，用于事务）
   */
  addMany: (treeEntityList: T[], em?: EntityManager) => Promise<T[]>
  /**
   * 生成树关系，并添加树关系
   * @param selfId 实体ID
   * @param em 实体管理器
   * @param parentId 父实体ID
   */
  addClosureNode: (selfId: string, em?: EntityManager, parentId?: string) => Promise<T[]>
  /**
   * 删除树关系（级联删除，后代变游离节点）
   * @param selfId 实体ID
   * @param em 实体管理器
   * @return 后代ID列表(用于修改表中的父ID)
   */
  deleteClosureNodeCascade: (selfId: string, em?: EntityManager) => Promise<T[]>
  /**
   * 删除树关系（除了自己和自己关系外的）
   * @param idList 实体ID列表
   * @param em 实体管理器
   */
  deleteRelations: (idList: string[], em?: EntityManager) => Promise<boolean>
  /**
   * 根据后代实体ID列表查询树关系
   * @param descendantIdList 后代实体ID列表
   * @param onlyParent 是否只找父关系
   * @param em 实体管理器
   */
  findManyByDescendantId: (descendantIdList: string[], onlyParent: boolean, em?: EntityManager) => Promise<T[]>
  /**
   * 根据祖先实体ID列表查询树关系
   * @param ancestorIdList 祖先实体ID列表
   * @param onlyChild 是否只找子关系
   * @param em 实体管理器
   */
  findManyByAncestorId: (ancestorIdList: string[], onlyChild: boolean, em?: EntityManager) => Promise<T[]>
  /**
   * 根据后代实体ID删除树关系
   * @param descendantIdList 后代实体ID列表
   * @param em 实体管理器
   */
  deleteByDescendantId: (descendantIdList: string[], em?: EntityManager) => Promise<boolean>
  /**
   * 根据祖先实体ID删除树关系
   * @param ancestorIdList 祖先实体ID列表
   * @param em 实体管理器
   */
  deleteByAncestorId: (ancestorIdList: string[], em?: EntityManager) => Promise<boolean>
  /**
   * 检查是否为后代关系
   * @param ancestorId 祖先ID
   * @param descendantId 后代ID
   * @param em 实体管理器（可选，用于事务）
   */
  isDescendant: (ancestorId: string, descendantId: string, em?: EntityManager) => Promise<boolean>
  /**
   * 检查实体是否存在（带锁检查）
   * @param options 查询条件
   * @param em 实体管理器（可选，用于事务）
   */
  existsWithLockIfNeeded: (options: FindOptionsWhere<T>, em?: EntityManager) => Promise<boolean>
  /**
   * 检查是否为直接子节点关系
   * @param childId 子节点ID
   * @param parentId 父节点ID
   * @param em 实体管理器（可选，用于事务）
   */
  isChild: (childId: string, parentId: string, em?: EntityManager) => Promise<boolean>
  /**
   * 移动树节点
   * @param selfId 当前节点ID
   * @param parentId 新的父节点ID（null表示移动到根节点）
   * @param em 实体管理器（可选，用于事务）
   */
  moveTree: (selfId: string, parentId: string | null, em?: EntityManager) => Promise<boolean>

  /**
   * 获取树的所有后代节点ID列表
   * @param rootIdList 根节点ID列表
   * @param depth 深度（-1表示无限制）
   * @param em 实体管理器（可选，用于事务）
   * @returns 所有后代节点ID列表
   */
  getTreeDescendantIds: (rootIdList: string[], depth?: number, em?: EntityManager) => Promise<string[]>
  /**
   * 构建树
   * @param rootIdList 根节点ID列表
   * @param nodeList 节点列表
   * @param VOConstructor 节点VO构造器
   * @returns 树节点VO列表
   */
  buildTree: <N extends ObjectLiteral, VO = any>(
    rootIdList: string[],
    nodeList: N[],
    VOConstructor: new (...args: any[]) => VO,
  ) => Promise<TTreeNodeVO<VO>[]>
}
