import type { EntityManager } from 'typeorm'
import type { AssignUsersRoleDTO, UserIdsDTO } from '../../dto'
import type { IUserRoleService } from '../IUserRoleService'
import type { RoleIdsDTO } from '@/modules/rbac/role/app'
import { Injectable } from '@nestjs/common'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextClass } from '@/common/deco'
import { RoleDomainService } from '@/modules/rbac/role/domain'
import { UserDomainService, UserEntity } from '../../../domain'
import { UserRoleRepository } from '../../../infra/repo'

/** 用户角色服务实现 */
@Injectable()
@LogContextClass()
export class UserRoleService implements IUserRoleService {
  constructor(
    private readonly userDomainService: UserDomainService,
    private readonly userRoleRepo: UserRoleRepository,
    private readonly roleDomainService: RoleDomainService,
  ) {}

  async getRoleIdsByUserId(userIds: UserIdsDTO, em?: EntityManager) {
    const { ids } = userIds
    return await this.userDomainService.getUsersByIds(ids, false, em)
  }

  async getUserIdsByRoleIds(roleIds: RoleIdsDTO, em?: EntityManager) {
    const { ids } = roleIds
    return await this.roleDomainService.getRolesByIds(ids, false, em)
  }

  async assignUsersRoleByIds(em: EntityManager, assignUsersRoleDTO: AssignUsersRoleDTO, by: string = SYSTEM_DEFAULT_BY) {
    const { ids, roleIds } = assignUsersRoleDTO
    const users = await this.userDomainService.getUsersByIds(ids, false, em)
    const roles = await this.roleDomainService.getRolesByIds(roleIds, false, em)
    await this.userRoleRepo.deleteMany(ids, 'user_id', em)
    const now = new Date()
    // 避免save级联更新导致重复冲突(只触发user_role的级联更新)
    roles.forEach((r) => {
      // role_menu
      r.menus = []
      // role_resource
      r.resources = []
    })
    users.forEach((u) => {
      u.roles = roles
      u.updatedBy = by
      u.updatedAt = now
    })
    return em.save(UserEntity, users)
  }
}
