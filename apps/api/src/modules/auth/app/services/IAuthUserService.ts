import type { ICreateUserDTO } from '@packages/types'
import type { EntityManager } from 'typeorm'

/** 认证用户服务接口 */
export interface IAuthUserService {
  register: (em: EntityManager, createUserDTOs: ICreateUserDTO[], by: string) => Promise<boolean>
}
