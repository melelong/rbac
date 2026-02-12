import type { ExcludeKeys } from '@/common/utils'
import type { IFindAllVOOptions } from '@/common/vo'
import { ResourceEntity } from '../../domain'
import { FindAllResourceVO, ResourceDetailsVO, ResourceIdsVO } from '../vo'

/** 资源转换器 */
export class ResourceVOAssembler {
  /** 将实体转换为详情VO */
  static toDetailsVO(resource: ResourceEntity) {
    return new ResourceDetailsVO(resource)
  }

  /** 将实体转换为分页VO */
  static toFindAllVO(options: ExcludeKeys<IFindAllVOOptions<ResourceEntity>, 'DataConstructor'>) {
    const { data, limit, page, total } = options
    return new FindAllResourceVO({ DataConstructor: ResourceDetailsVO, data, limit, page, total })
  }

  /** 将实体列表转换为ID列表VO */
  static toIdsVO(resources: ResourceEntity[]) {
    return new ResourceIdsVO(resources)
  }
}
