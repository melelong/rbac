import type { EntityManager } from 'typeorm'
import type { CreateResourceDTO, UpdateResourceDTO } from '../../app'
import type { IResourceEntity } from '../entities'
import type { FindAllDTO, UpdateSortDTO, UpdateStatusDTO } from '@/common/dto'

/** 资源领域服务接口 */
export interface IResourceDomainService {
  /** 缓存表字段名(用于辨别修改字段属于哪个表) */
  columns: string[]
  // 基本
  /** 创建资源 */
  createResources: (em: EntityManager, createDTOList: CreateResourceDTO[], by?: string) => Promise<IResourceEntity[]>
  /** 删除资源 */
  deleteResources: (em: EntityManager, idList: string[], by?: string) => Promise<boolean>
  /** 修改资源 */
  updateResources: (em: EntityManager, idList: string[], updateDTOList: UpdateResourceDTO[], by?: string) => Promise<boolean>
  /** 修改资源状态 */
  updateResourcesStatus: (em: EntityManager, idList: string[], updateStatusDTOList: UpdateStatusDTO[], by?: string) => Promise<boolean>
  /** 修改资源排序 */
  updateResourcesSort: (em: EntityManager, idList: string[], UpdateSortDTOList: UpdateSortDTO[], by?: string) => Promise<boolean>
  /** 获取资源详情列表 */
  getResources: (findAllDTO: FindAllDTO, relations: boolean, em?: EntityManager) => Promise<[IResourceEntity[], number]>
  /** 通过资源ID获取资源详情 */
  getResourcesByIds: (idList: string[], relations: boolean, em?: EntityManager) => Promise<IResourceEntity[]>
  /** 通过资源名获取资源详情 */
  getResourcesByNames: (nameList: string[], relations: boolean, em?: EntityManager) => Promise<IResourceEntity[]>
  // 特有的
  /** 通过资源编码获取资源详情 */
  getResourcesByCodes: (resourceCodeList: string[], em?: EntityManager) => Promise<IResourceEntity[]>
}
