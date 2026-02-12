import type { EntityManager } from 'typeorm'

/** 资源校验服务接口 */
export interface IResourceValidateService {
  // 基本
  /** 校验资源ID */
  validateId: (idList: string[], expectExists?: boolean, em?: EntityManager) => Promise<void>
  /** 校验资源名 */
  validateName: (nameList: string[], expectExists?: boolean, em?: EntityManager) => Promise<void>
  // 特有
  /** 校验资源编码 */
  validateCode: (codeList: string[], expectExists?: boolean, em?: EntityManager) => Promise<void>
}
