import type { TTreeNodeVO } from '@packages/types'
import type { EntityManager } from 'typeorm'
import type { CreateMenuDTO, UpdateMenuDTO } from '../../app'
import type { IMenuEntity } from '../entities'
import type { FindAllDTO, UpdateSortDTO, UpdateStatusDTO } from '@/common/dto'

/** 菜单领域服务接口 */
export interface IMenuDomainService {
  /** 缓存表字段名(用于辨别修改字段属于哪个表) */
  columns: string[]
  // 基本
  /** 创建菜单 */
  createMenus: (em: EntityManager, createDTOList: CreateMenuDTO[], by?: string) => Promise<IMenuEntity[]>
  /** 删除菜单 */
  deleteMenus: (em: EntityManager, idList: string[], by?: string, deleteDescendant?: boolean) => Promise<boolean>
  /** 修改菜单 */
  updateMenus: (em: EntityManager, idList: string[], updateDTOList: UpdateMenuDTO[], by?: string) => Promise<boolean>
  /** 修改菜单状态 */
  updateMenusStatus: (em: EntityManager, idList: string[], updateStatusDTOList: UpdateStatusDTO[], by?: string) => Promise<boolean>
  /** 修改菜单排序 */
  updateMenusSort: (em: EntityManager, idList: string[], UpdateSortDTOList: UpdateSortDTO[], by?: string) => Promise<boolean>
  /** 获取菜单详情列表 */
  getMenus: (findAllDTO: FindAllDTO, relations: boolean, em?: EntityManager) => Promise<[IMenuEntity[], number]>
  /** 通过菜单ID获取菜单详情 */
  getMenusByIds: (idList: string[], relations: boolean, em?: EntityManager) => Promise<IMenuEntity[]>
  /** 通过菜单名获取菜单详情 */
  getMenusByNames: (nameList: string[], relations: boolean, em?: EntityManager) => Promise<IMenuEntity[]>
  // 特有的
  /** 移动菜单树节点 */
  moveMenus: (em: EntityManager, idList: string[], parentIdList: (string | null)[], by?: string) => Promise<IMenuEntity[]>
  /** 获取菜单树节点 */
  getMenuTreesByIds: <VO = any>(
    idList: string[],
    VOConstructor: new (...args: any[]) => VO,
    depth?: number,
    em?: EntityManager,
  ) => Promise<TTreeNodeVO<VO>[]>
}
