import type { IFindAllVO } from '@packages/types'

export interface IFindAllVOOptions<T = any> {
  /** 数据的构造函数 */
  DataConstructor: new (...args: any[]) => T
  /** 数据列表 */
  data: T[]
  /** 一页几条数据 */
  limit: number
  /** 第几页 */
  page: number
  /** 总数 */
  total: number
}

export abstract class FindAllVO<T = any> implements IFindAllVO<T> {
  /**
   * 详情列表(需要子类实现)
   */
  abstract data: T[]
  /**
   * 总数
   * @example 1000
   */
  total: number
  /**
   * 第几页
   * @example 1
   */
  page: number
  /**
   * 一页几条数据
   * @example 100
   */
  limit: number
  /**
   * 总页数
   * @example 200
   */
  totalPages: number
  constructor(findAllVOOptions?: IFindAllVOOptions<T>) {
    if (findAllVOOptions) {
      const { limit, page, total } = findAllVOOptions
      this.limit = limit
      this.page = page
      this.total = total
      this.totalPages = Math.ceil(total / limit)
    }
  }
}
