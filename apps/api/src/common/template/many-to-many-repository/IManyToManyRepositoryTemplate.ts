import type { EntityManager } from 'typeorm'

/**
 * 多对多中间表仓库模板接口
 * @description 基于TypeORM的通用多对多中间表操作模板接口
 */
export interface IManyToManyRepositoryTemplate {
  /**
   * 删除多对多中间表中的记录
   * @param ids 要删除的记录ID列表
   * @param columnKey 多对多中间表中的记录ID列名
   * @param em 可选的实体管理器实例
   * @returns 删除操作是否成功
   */
  deleteMany: (ids: string[], columnKey: string, em?: EntityManager) => Promise<boolean>
}
