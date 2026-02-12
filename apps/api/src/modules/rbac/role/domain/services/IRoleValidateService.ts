import type { EntityManager } from 'typeorm'

/** 角色校验服务接口 */
export interface IRoleValidateService {
  // 基本
  /** 校验角色ID */
  validateId: (idList: string[], expectExists?: boolean, em?: EntityManager) => Promise<void>
  /** 校验角色名 */
  validateName: (nameList: string[], expectExists?: boolean, em?: EntityManager) => Promise<void>
  // 特有
  /** 校验角色编码 */
  validateCode: (codeList: string[], expectExists?: boolean, em?: EntityManager) => Promise<void>
}
