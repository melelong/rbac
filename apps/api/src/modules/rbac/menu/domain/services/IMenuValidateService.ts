import type { EntityManager } from 'typeorm'

/** 菜单校验服务接口 */
export interface IMenuValidateService {
  // 基本
  /** 校验菜单ID */
  validateId: (idList: string[], expectExists?: boolean, em?: EntityManager) => Promise<void>
  /** 校验菜单名 */
  validateName: (nameList: string[], expectExists?: boolean, em?: EntityManager) => Promise<void>
  // 特有
}
