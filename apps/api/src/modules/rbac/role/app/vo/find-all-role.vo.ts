import type { IFindAllRoleVO } from '@packages/types'
import type { IFindAllVOOptions } from '@/common/vo'
import { ApiSchema } from '@nestjs/swagger'
import { FindAllVO } from '@/common/vo'
import { RoleDetailsVO } from './role-details.vo'

/** 分页查询角色详情列表 */
@ApiSchema({ description: '分页查询角色详情列表' })
export class FindAllRoleVO extends FindAllVO<RoleDetailsVO> implements IFindAllRoleVO {
  /**
   * 角色详情列表
   */
  data: RoleDetailsVO[]
  constructor(findAllVOOptions?: IFindAllVOOptions<RoleDetailsVO>) {
    super(findAllVOOptions)
    if (findAllVOOptions) {
      const { DataConstructor, data } = findAllVOOptions
      this.data = data.map((data) => new DataConstructor(data))
    }
  }
}
