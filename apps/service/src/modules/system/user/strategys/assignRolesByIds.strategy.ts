import type { EntityManager } from 'typeorm'
import type { AssignRolesByIdsDTO } from '../dto'
import type { ITransactionTemplateStrategy } from '@/common/template'
import { UserBusiness, UserBusinessTextMap } from '@packages/types'
import { In } from 'typeorm'
import { BusinessException } from '@/common/exceptions'
import { RoleEntity } from '@/modules/system/role/entities/role.entity'
import { UserEntity } from '../entities/user.entity'
import { SYS_USER_ROLE } from '../user.constant'

export interface IAssignRolesByIdsStrategyOptions {
  /** 分配角色参数 */
  assignRolesByIdsDTO: AssignRolesByIdsDTO
  /** 操作者 */
  by: string
}

interface IValidateValue {
  /** 用户信息 */
  user: UserEntity
  /** 角色列表 */
  roles: RoleEntity[]
  /** 操作者 */
  by: string
}
export class AssignRolesByIdsStrategy implements ITransactionTemplateStrategy<boolean, IValidateValue> {
  private readonly assignRolesByIdsDTO: AssignRolesByIdsDTO
  private readonly by: string
  constructor(options: IAssignRolesByIdsStrategyOptions) {
    const { assignRolesByIdsDTO, by } = options
    this.assignRolesByIdsDTO = assignRolesByIdsDTO
    this.by = by
  }

  async validate(em: EntityManager): Promise<IValidateValue> {
    const { id, roleIds } = this.assignRolesByIdsDTO
    const by = this.by
    const user = await em.findOne(UserEntity, { where: { id }, lock: { mode: 'pessimistic_write' } })
    if (!user) throw new BusinessException(UserBusiness.NOT_FOUND, UserBusinessTextMap)
    const roles = await em.findBy(RoleEntity, { id: In(roleIds) })
    if (roles.length !== roleIds.length) throw new BusinessException(UserBusiness.ROLE_NOT_FOUND, UserBusinessTextMap)
    return { user, roles, by }
  }

  async handler(em: EntityManager, { user, roles, by }: IValidateValue) {
    // 清空用户和角色的关系
    await em.createQueryBuilder().delete().from(SYS_USER_ROLE).where('user_id = :userId', { userId: user.id }).execute()
    const now = new Date()
    user.roles = roles
    user.updatedAt = now
    user.updatedBy = by
    await em.save(UserEntity, user)
    return true
  }
}
