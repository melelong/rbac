import type { IMenuEntity } from '../entities'
import type { ICrudRepositoryTemplate } from '@/common/template'

/** 菜单仓库接口 */
export interface IMenuRepository extends ICrudRepositoryTemplate<IMenuEntity> {}
