import type { EntityManager } from 'typeorm'

/** 用户校验服务接口 */
export interface IUserValidateService {
  // 基本
  /** 校验用户ID */
  validateId: (idList: string[], expectExists?: boolean, em?: EntityManager) => Promise<void>
  /** 校验用户名 */
  validateName: (nameList: string[], expectExists?: boolean, em?: EntityManager) => Promise<void>
  // 特有
  /** 校验邮箱 */
  validateEmail: (emailList: string[], expectExists?: boolean, em?: EntityManager) => Promise<void>
  /** 校验手机号 */
  validatePhone: (phoneList: string[], expectExists?: boolean, em?: EntityManager) => Promise<void>
}
