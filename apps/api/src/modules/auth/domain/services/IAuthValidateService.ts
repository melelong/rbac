import type { EntityManager } from 'typeorm'
/** 认证校验服务接口 */
export interface IAuthValidateService {
  // 基本
  /** 校验认证ID */
  validateId: (idList: string[], expectExists?: boolean, em?: EntityManager) => Promise<void>
  /** 校验认证名 */
  validateName: (nameList: string[], expectExists?: boolean, em?: EntityManager) => Promise<void>
  // 特有
}
