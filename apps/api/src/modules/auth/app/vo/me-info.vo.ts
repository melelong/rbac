import type { IMeInfoVO } from '@packages/types'
import type { UserEntity } from '@/modules/rbac/user/domain'
import { ApiSchema } from '@nestjs/swagger'
import { omit } from 'lodash-es'
import { UserDetailsVO } from '@/modules/rbac/user/app'

/** 当前登录用户信息 */
@ApiSchema({ description: '当前登录用户信息' })
export class MeInfoVO extends UserDetailsVO implements IMeInfoVO {
  /**
   * 角色编码
   * @example []
   */
  roles: string[]
  /**
   * 菜单编码
   * @example []
   */
  menus: string[]
  constructor(user?: UserEntity) {
    super()
    if (user) {
      const keys = [
        '_id',
        'pwd',
        'loginIp',
        'salt',
        'roles',
        'pwdUpdateAt',
        'pwdUpdateBy',
        'createdAt',
        'createdBy',
        'updatedAt',
        'updatedBy',
        'deletedAt',
        'deletedBy',
      ]
      const omitResult = omit(user, keys)
      Object.assign(this, omitResult)
      const { roles } = user
      this.roles = roles.map((r) => r.roleCode)
      this.menus = roles.flatMap((r) => r.menus.map((m) => m.menuCode))
    }
  }
}
