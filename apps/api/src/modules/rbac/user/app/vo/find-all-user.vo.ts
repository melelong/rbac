import type { IFindAllUserVO } from '@packages/types'
import type { IFindAllVOOptions } from '@/common/vo'
import { ApiSchema } from '@nestjs/swagger'
import { FindAllVO } from '@/common/vo'
import { UserDetailsVO } from './user-details.vo'

/** 分页查询用户详情列表 */
@ApiSchema({ description: '分页查询用户详情列表' })
export class FindAllUserVO extends FindAllVO<UserDetailsVO> implements IFindAllUserVO {
  /**
   * 用户详情列表
   */
  data: UserDetailsVO[]
  constructor(findAllVOOptions?: IFindAllVOOptions<UserDetailsVO>) {
    super(findAllVOOptions)
    if (findAllVOOptions) {
      const { DataConstructor, data } = findAllVOOptions
      this.data = data.map((data) => new DataConstructor(data))
    }
  }
}
