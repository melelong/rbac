import type { ITokenVO } from '@packages/types'
import type { Response } from 'express'
import type { EntityManager } from 'typeorm'
import type { CreateAuthDTO, UpdateAuthDTO } from '../../app'
import type { IAuthEntity } from '../entities'
import type { FindAllDTO, UpdateSortDTO, UpdateStatusDTO } from '@/common/dto'

/** 登录类型 */
export const LOGIN_TYPE = ['svg', 'email', 'phone'] as const
export type TLoginType = (typeof LOGIN_TYPE)[number]
/** 认证领域服务接口 */
export interface IAuthDomainService {
  /** 缓存表字段名(用于辨别修改字段属于哪个表) */
  columns: string[]
  // 基本
  /** 创建认证 */
  createAuths: (em: EntityManager, createDTOList: CreateAuthDTO[], by?: string) => Promise<IAuthEntity[]>
  /** 删除认证 */
  deleteAuths: (em: EntityManager, idList: string[], by?: string) => Promise<boolean>
  /** 修改认证 */
  updateAuths: (em: EntityManager, idList: string[], updateDTOList: UpdateAuthDTO[], by?: string) => Promise<boolean>
  /** 修改认证状态 */
  updateAuthsStatus: (em: EntityManager, idList: string[], updateStatusDTOList: UpdateStatusDTO[], by?: string) => Promise<boolean>
  /** 修改认证排序 */
  updateAuthsSort: (em: EntityManager, idList: string[], UpdateSortDTOList: UpdateSortDTO[], by?: string) => Promise<boolean>
  /** 获取认证详情列表 */
  getAuths: (findAllDTO: FindAllDTO, relations: boolean, em?: EntityManager) => Promise<[IAuthEntity[], number]>
  /** 通过认证ID获取认证详情 */
  getAuthsByIds: (idList: string[], relations: boolean, em?: EntityManager) => Promise<IAuthEntity[]>
  /** 通过认证名获取认证详情 */
  getAuthsByNames: (nameList: string[], relations: boolean, em?: EntityManager) => Promise<IAuthEntity[]>
  // 特有的
  /** 注册 */
  // register: (em: EntityManager, createDTOList: CreateAuthDTO[]) => Promise<IAuthEntity[]>
  /** 登录 */
  login: (res: Response) => Promise<ITokenVO>
  /** 登出 */
  logout: (res: Response) => Promise<boolean>
  /** 刷新token */
  refreshToken: (res: Response) => Promise<ITokenVO>
}
