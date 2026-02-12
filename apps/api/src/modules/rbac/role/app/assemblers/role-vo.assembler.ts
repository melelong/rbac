import type { ExcludeKeys } from '@/common/utils'
import type { IFindAllVOOptions } from '@/common/vo'
import { RoleEntity } from '../../domain'
import { FindAllRoleVO, RoleDetailsVO, RoleIdsVO } from '../vo'

/** 角色转换器 */
export class RoleVOAssembler {
  /** 将实体转换为详情VO */
  static toDetailsVO(role: RoleEntity) {
    return new RoleDetailsVO(role)
  }

  /** 将实体转换为分页VO */
  static toFindAllVO(options: ExcludeKeys<IFindAllVOOptions<RoleEntity>, 'DataConstructor'>) {
    const { data, limit, page, total } = options
    return new FindAllRoleVO({ DataConstructor: RoleDetailsVO, data, limit, page, total })
  }

  /** 将实体列表转换为ID列表VO */
  static toIdsVO(roles: RoleEntity[]) {
    return new RoleIdsVO(roles)
  }
}
