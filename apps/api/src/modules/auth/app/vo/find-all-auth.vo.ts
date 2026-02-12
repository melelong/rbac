import type { IFindAllAuthVO } from '@packages/types'
import type { IFindAllVOOptions } from '@/common/vo'
import { ApiSchema } from '@nestjs/swagger'
import { FindAllVO } from '@/common/vo'
import { AuthDetailsVO } from './auth-details.vo'

/** 分页查询认证详情列表 */
@ApiSchema({ description: '分页查询认证详情列表' })
export class FindAllAuthVO extends FindAllVO<AuthDetailsVO> implements IFindAllAuthVO {
  /**
   * 认证详情列表
   */
  data: AuthDetailsVO[]
  constructor(findAllVOOptions?: IFindAllVOOptions<AuthDetailsVO>) {
    super(findAllVOOptions)
    if (findAllVOOptions) {
      const { DataConstructor, data } = findAllVOOptions
      this.data = data.map((data) => new DataConstructor(data))
    }
  }
}
