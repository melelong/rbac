import type { IFindAllMenuVO } from '@packages/types'
import type { IFindAllVOOptions } from '@/common/vo'
import { ApiSchema } from '@nestjs/swagger'
import { FindAllVO } from '@/common/vo'
import { MenuDetailsVO } from './menu-details.vo'

/** 分页查询菜单详情列表 */
@ApiSchema({ description: '分页查询菜单详情列表' })
export class FindAllMenuVO extends FindAllVO<MenuDetailsVO> implements IFindAllMenuVO {
  /**
   * 菜单详情列表
   */
  data: MenuDetailsVO[]
  constructor(findAllVOOptions?: IFindAllVOOptions<MenuDetailsVO>) {
    super(findAllVOOptions)
    if (findAllVOOptions) {
      const { DataConstructor, data } = findAllVOOptions
      this.data = data.map((data) => new DataConstructor(data))
    }
  }
}
