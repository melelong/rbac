import type { IResourceIdsVO } from '@packages/types'
import type { ResourceEntity } from '../../domain'

/** 资源ID列表VO */
export class ResourceIdsVO implements IResourceIdsVO {
  /**
   * 资源ID列表
   * @example []
   */
  ids: string[]
  constructor(resources?: ResourceEntity[]) {
    if (resources) this.ids = resources.map((item) => item.id)
  }
}
