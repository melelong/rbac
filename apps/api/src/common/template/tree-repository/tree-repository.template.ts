import type { TTreeNodeVO } from '@packages/types'
import type { DeepPartial, FindManyOptions, FindOptionsWhere, ObjectLiteral } from 'typeorm'
import type { ITreeRepositoryTemplate } from './ITreeRepositoryTemplate'
import type { LoggingService } from '@/common/infra'
import { EntityManager, In, LessThanOrEqual, Repository } from 'typeorm'
import { LogContextMethod } from '@/common/deco'

/**
 * Tree仓库抽象模板类
 * 提供通用的树型操作实现
 */
export abstract class TreeRepositoryTemplate<T extends ObjectLiteral> extends Repository<T> implements ITreeRepositoryTemplate<T> {
  constructor(
    protected readonly treeEntityClass: new () => T,
    protected readonly entityManager: EntityManager,
    protected readonly loggingService: LoggingService,
  ) {
    super(treeEntityClass, entityManager)
  }

  @LogContextMethod()
  async addMany(treeEntityList: T[], em?: EntityManager) {
    this.loggingService.debug('run')
    if (treeEntityList.length <= 0) return []
    return em ? await em.save(this.treeEntityClass, treeEntityList) : await this.save(treeEntityList)
  }

  @LogContextMethod()
  async addClosureNode(selfId: string, em?: EntityManager, parentId?: string) {
    this.loggingService.debug('run')
    const tree: T[] = []
    // 自节点树的关系
    const selfTreeRelations = this.create({ ancestorId: selfId, descendantId: selfId, depth: 0 } as unknown as DeepPartial<T>)
    tree.push(selfTreeRelations)
    // 父节点树关系
    if (parentId) {
      const parentTreeRelations = await this.findManyByDescendantId([parentId], false, em)
      const newParentTreeRelations = parentTreeRelations.map((item) =>
        this.create({ ancestorId: item.ancestorId, descendantId: selfId, depth: item.depth + 1 } as unknown as DeepPartial<T>),
      )
      tree.push(...newParentTreeRelations)
    }
    return await this.addMany(tree, em)
  }

  @LogContextMethod()
  async deleteClosureNodeCascade(selfId: string, em?: EntityManager) {
    this.loggingService.debug('run')
    // 所有selfId后代节点的ID列表
    const descendantRelations = await this.findManyByAncestorId([selfId], false, em)
    const descendantIds = descendantRelations.map((item) => item.descendantId as string)
    if (descendantIds.length > 0) {
      await Promise.all([this.deleteByAncestorId([selfId], em)])
      await this.deleteRelations(descendantIds, em)
    }
    return descendantRelations
  }

  @LogContextMethod()
  async deleteRelations(idList: string[], em?: EntityManager) {
    this.loggingService.debug('run')
    if (idList.length <= 0) return true
    const _this = em || this
    const sql = _this.createQueryBuilder().delete().from(this.treeEntityClass)
    idList.length === 1
      ? sql.where('descendant_id = :id', { id: idList[0] }).andWhere('ancestor_id <> :id', { id: idList[0] })
      : sql.where('descendant_id IN (:...idList)', { idList }).andWhere('ancestor_id <> descendant_id')
    const res = await sql.execute()
    return res.affected !== 0
  }

  @LogContextMethod()
  async findManyByDescendantId(descendantIdList: string[], parent: boolean = false, em?: EntityManager) {
    this.loggingService.debug('run')
    if (descendantIdList.length <= 0) return []
    const options = {
      where: { descendantId: descendantIdList.length === 1 ? descendantIdList[0] : In(descendantIdList) },
    } as unknown as FindManyOptions<T>
    if (parent) (options.where as FindOptionsWhere<T> & { depth: number })!.depth = 1
    return em ? await em.find(this.treeEntityClass, { ...options, lock: { mode: 'pessimistic_write' } }) : await this.find(options)
  }

  @LogContextMethod()
  async findManyByAncestorId(ancestorIdList: string[], child: boolean = false, em?: EntityManager) {
    this.loggingService.debug('run')
    if (ancestorIdList.length <= 0) return []
    const options = { where: { ancestorId: ancestorIdList.length === 1 ? ancestorIdList[0] : In(ancestorIdList) } } as unknown as FindManyOptions<T>
    if (child) (options.where as FindOptionsWhere<T> & { depth: number })!.depth = 1
    return em ? await em.find(this.treeEntityClass, { ...options, lock: { mode: 'pessimistic_write' } }) : await this.find(options)
  }

  @LogContextMethod()
  async deleteByDescendantId(descendantIdList: string[], em?: EntityManager) {
    this.loggingService.debug('run')
    if (descendantIdList.length <= 0) return true
    const options = { descendantId: In(descendantIdList) } as unknown as FindOptionsWhere<T>
    const res = em ? await em.delete(this.treeEntityClass, options) : await this.delete(options)
    return res.affected !== 0
  }

  @LogContextMethod()
  async deleteByAncestorId(ancestorIdList: string[], em?: EntityManager) {
    this.loggingService.debug('run')

    if (ancestorIdList.length <= 0) return true
    const options = { ancestorId: In(ancestorIdList) } as unknown as FindOptionsWhere<T>
    const res = em ? await em.delete(this.treeEntityClass, options) : await this.delete(options)
    return res.affected !== 0
  }

  @LogContextMethod()
  async isDescendant(ancestorId: string, descendantId: string, em?: EntityManager): Promise<boolean> {
    this.loggingService.debug('run')
    const options = { ancestorId, descendantId } as unknown as FindOptionsWhere<T>
    return await this.existsWithLockIfNeeded(options, em)
  }

  @LogContextMethod()
  async existsWithLockIfNeeded(options: FindOptionsWhere<T>, em?: EntityManager): Promise<boolean> {
    this.loggingService.debug('run')
    return em
      ? await em.createQueryBuilder().from(this.treeEntityClass, 'TE').where(options).setLock('pessimistic_write').getExists()
      : await this.existsBy(options)
  }

  @LogContextMethod()
  async isChild(childId: string, parentId: string, em?: EntityManager) {
    this.loggingService.debug('run')
    const options = { ancestorId: parentId, descendantId: childId, depth: 1 } as unknown as FindOptionsWhere<T>
    return await this.existsWithLockIfNeeded(options, em)
  }

  @LogContextMethod()
  async moveTree(selfId: string, parentId: string | null, em?: EntityManager): Promise<boolean> {
    this.loggingService.debug('run')
    const _this = em || this
    // 移动的节点的所有后代
    const descendantRelations = await this.findManyByAncestorId([selfId], false, em)
    const descendantIds = descendantRelations.map((item) => item.descendantId)

    // 完全断开子树与旧祖先的连接
    // 要移动的节点的所有旧祖先
    const oldAncestorRelations = await _this
      .createQueryBuilder()
      .from(this.treeEntityClass, 'TE')
      .select(['TE.ancestor_id'])
      .where('TE.descendant_id = :selfId', { selfId })
      .andWhere('TE.ancestor_id <> :selfId', { selfId })
      .getRawMany()
    const oldAncestorIds = oldAncestorRelations.map((item) => item.ancestor_id)
    // 删除旧祖先与整个后代子树之间的所有关系
    if (oldAncestorIds.length > 0 && descendantIds.length > 0) {
      await _this
        .createQueryBuilder()
        .delete()
        .from(this.treeEntityClass)
        .where('ancestor_id IN (:...oldAncestorIds)', { oldAncestorIds })
        .andWhere('descendant_id IN (:...descendantIds)', { descendantIds })
        .execute()
    }

    if (parentId) {
      // 获取新父节点的所有祖先关系
      const parentRelations = await this.findManyByDescendantId([parentId], false, em)
      // 要移动的节点的新祖先关系
      const newRelations = parentRelations.map((item) =>
        this.create({
          ancestorId: item.ancestorId,
          descendantId: selfId,
          depth: item.depth + 1,
        } as unknown as DeepPartial<T>),
      )

      // 为移动节点的所有后代创建与新父级及其所有祖先的关系
      const nonSelfDescendants = descendantIds.filter((did) => did !== selfId)
      if (nonSelfDescendants.length > 0) {
        parentRelations.forEach((relation) => {
          nonSelfDescendants.forEach((descendantId) => {
            // 找到当前后代与移动节点之间的原始深度
            const depthToMovingNode = descendantRelations.find((item) => item.descendantId === descendantId && item.ancestorId === selfId)?.depth || 0
            newRelations.push(
              this.create({
                ancestorId: relation.ancestorId,
                descendantId,
                depth: relation.depth + 1 + depthToMovingNode,
              } as unknown as DeepPartial<T>),
            )
          })
        })
      }
      if (newRelations.length > 0) await this.addMany(newRelations, em)
    }
    return true
  }

  @LogContextMethod()
  async getTreeDescendantIds(rootIdList: string[], depth: number = -1, em?: EntityManager) {
    this.loggingService.debug('run')
    if (rootIdList.length <= 0) return []
    const where = { ancestorId: rootIdList.length === 1 ? rootIdList[0] : In(rootIdList) } as unknown as FindOptionsWhere<T>
    // 不是0时，只获取指定深度的树形结构
    if (depth !== -1) (where as any).depth = LessThanOrEqual(depth)
    // 所有后代节点关系
    const descendantRelations = em ? await em.find(this.treeEntityClass, { where }) : await this.find({ where })
    if (descendantRelations.length === 0) return []
    const _descendantIds = descendantRelations.map((item) => item.descendantId as string)
    // 所有后代节点ID列表
    const descendantIds = [...new Set([...rootIdList, ..._descendantIds])]
    return descendantIds
  }

  @LogContextMethod()
  async buildTree<N extends ObjectLiteral, VO = any>(rootIdList: string[], nodeList: N[], VOConstructor: new (...args: any[]) => VO) {
    // 缓存表 节点id:节点内容
    const cache: {
      [key: string]: TTreeNodeVO<VO>
    } = {}
    // 树结构
    const roots: TTreeNodeVO<VO>[] = []
    // 缓存节点信息
    for (let i = 0, len = nodeList.length; i < len; i++) {
      const node = nodeList[i]
      const cacheNode = new VOConstructor(node) as TTreeNodeVO<VO>
      cache[node.id] = cacheNode
    }
    // 构建树
    for (let j = 0, len = nodeList.length; j < len; j++) {
      const node = nodeList[j]
      // 是否是根节点(对比根节点ID列表)
      const isRootId = rootIdList.includes(node.id)
      if (isRootId) {
        // 是根节点(包含父节点非null)
        const self = cache[node.id]
        roots.push(self)
      }
      if (node.parentId) {
        // 不是根节点
        const parent = cache[node.parentId]
        if (parent) {
          const self = cache[node.id]
          parent.children = parent.children || []
          parent.children.push(self)
        }
      }
    }
    return roots
  }
}
