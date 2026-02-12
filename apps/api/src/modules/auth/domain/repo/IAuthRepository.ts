import type { IAuthEntity } from '../entities'
import type { ICrudRepositoryTemplate } from '@/common/template'

/** 认证仓库接口 */
export interface IAuthRepository extends ICrudRepositoryTemplate<IAuthEntity> {}
