import type { IUserProfileEntity } from '../entities'
import type { ICrudRepositoryTemplate } from '@/common/template'

/** 用户档案仓库接口 */
export interface IUserProfileRepository extends ICrudRepositoryTemplate<IUserProfileEntity> {}
