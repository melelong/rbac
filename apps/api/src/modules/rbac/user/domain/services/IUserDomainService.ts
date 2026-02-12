import type { EntityManager } from 'typeorm'
import type { CreateUserDTO, UpdateUserDTO } from '../../app'
import type { IUserEntity } from '../entities'
import type { FindAllDTO, UpdateSortDTO, UpdateStatusDTO } from '@/common/dto'

/** 用户领域服务接口 */
export interface IUserDomainService {
  /** 缓存表字段名(用于辨别修改字段属于哪个表) */
  columns: string[]
  /** 缓存表字段名(用于辨别修改字段属于哪个表) */
  columnsProfile: string[]
  // 基本
  /** 创建用户 */
  createUsers: (em: EntityManager, createDTOList: CreateUserDTO[], by?: string) => Promise<IUserEntity[]>
  /** 删除用户 */
  deleteUsers: (em: EntityManager, idList: string[], by?: string) => Promise<boolean>
  /** 修改用户 */
  updateUsers: (em: EntityManager, idList: string[], updateDTOList: UpdateUserDTO[], by?: string) => Promise<boolean>
  /** 修改用户状态 */
  updateUsersStatus: (em: EntityManager, idList: string[], updateStatusDTOList: UpdateStatusDTO[], by?: string) => Promise<boolean>
  /** 修改用户排序 */
  updateUsersSort: (em: EntityManager, idList: string[], UpdateSortDTOList: UpdateSortDTO[], by?: string) => Promise<boolean>
  /** 获取用户详情列表 */
  getUsers: (findAllDTO: FindAllDTO, relations: boolean, em?: EntityManager) => Promise<[IUserEntity[], number]>
  /** 通过用户ID获取用户详情 */
  getUsersByIds: (idList: string[], relations: boolean, em?: EntityManager) => Promise<IUserEntity[]>
  /** 通过用户名获取用户详情 */
  getUsersByNames: (nameList: string[], relations: boolean, em?: EntityManager) => Promise<IUserEntity[]>
  // 特有的
  /** 重置用户密码 */
  resetUsersPwd: (em: EntityManager, idList: string[], pwdList: string[], by?: string) => Promise<boolean>
  /** 通过邮箱获取用户详情 */
  getUsersByEmails: (emailList: string[], em?: EntityManager) => Promise<IUserEntity[]>
  /** 通过手机号获取用户详情 */
  getUsersByPhones: (phoneList: string[], em?: EntityManager) => Promise<IUserEntity[]>
  /** 加密密码 */
  encryptPwd: (pwd: string, userSalt: string) => Promise<string>
  /** 对比密码 */
  comparePwd: (currentPwd: string, userSalt: string, encryptedPwd: string) => Promise<boolean>
}
