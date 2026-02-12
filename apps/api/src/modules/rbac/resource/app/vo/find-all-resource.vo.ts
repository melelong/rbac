import type { IFindAllResourceVO } from '@packages/types'
import type { IFindAllVOOptions } from '@/common/vo'
import { ApiSchema } from '@nestjs/swagger'
import { FindAllVO } from '@/common/vo'
import { ResourceDetailsVO } from './resource-details.vo'

/** 分页查询资源详情列表 */
@ApiSchema({ description: '分页查询资源详情列表' })
export class FindAllResourceVO extends FindAllVO<ResourceDetailsVO> implements IFindAllResourceVO {
  /**
   * 资源详情列表
   */
  data: ResourceDetailsVO[]
  constructor(findAllVOOptions?: IFindAllVOOptions<ResourceDetailsVO>) {
    super(findAllVOOptions)
    if (findAllVOOptions) {
      const { DataConstructor, data } = findAllVOOptions
      this.data = data.map((data) => new DataConstructor(data))
    }
  }
}
