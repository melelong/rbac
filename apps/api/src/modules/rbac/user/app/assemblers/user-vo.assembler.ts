import type { ExcludeKeys } from '@/common/utils'
import type { IFindAllVOOptions } from '@/common/vo'
import { UserEntity } from '../../domain'
import { FindAllUserVO, UserDetailsVO, UserIdsVO } from '../vo'

/** 用户转换器 */
export class UserVOAssembler {
  /** 将实体转换为详情VO */
  static toDetailsVO(user: UserEntity) {
    return new UserDetailsVO(user)
  }

  /** 将实体转换为分页VO */
  static toFindAllVO(options: ExcludeKeys<IFindAllVOOptions<UserEntity>, 'DataConstructor'>) {
    const { data, limit, page, total } = options
    return new FindAllUserVO({ DataConstructor: UserDetailsVO, data, limit, page, total })
  }

  /** 将实体列表转换为ID列表VO */
  static toIdsVO(users: UserEntity[]) {
    return new UserIdsVO(users)
  }
}
