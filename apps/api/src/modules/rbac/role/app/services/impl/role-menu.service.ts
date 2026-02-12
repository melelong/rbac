import type { EntityManager } from 'typeorm'
import type { AssignRolesMenuDTO, RoleIdsDTO } from '../../dto'
import type { IRoleMenuService } from '../IRoleMenuService'
import type { MenuIdsDTO } from '@/modules/rbac/menu/app'
import { Injectable } from '@nestjs/common'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextClass } from '@/common/deco'
import { MenuDomainService } from '@/modules/rbac/menu/domain'
import { RoleDomainService, RoleEntity } from '@/modules/rbac/role/domain'
import { RoleMenuRepository } from '../../../infra/repo'

/** 角色菜单服务实现 */
@Injectable()
@LogContextClass()
export class RoleMenuService implements IRoleMenuService {
  constructor(
    private readonly roleDomainService: RoleDomainService,
    private readonly RoleMenuRepo: RoleMenuRepository,
    private readonly menuDomainService: MenuDomainService,
  ) {}

  async getMenuIdsByRoleIds(roleIds: RoleIdsDTO, em?: EntityManager) {
    const { ids } = roleIds
    return await this.roleDomainService.getRolesByIds(ids, false, em)
  }

  async getRoleIdsByMenuIds(menuIds: MenuIdsDTO, em?: EntityManager) {
    const { ids } = menuIds
    return await this.menuDomainService.getMenusByIds(ids, false, em)
  }

  async assignRolesMenuByIds(em: EntityManager, assignRolesMenuDTO: AssignRolesMenuDTO, by: string = SYSTEM_DEFAULT_BY) {
    const { ids, menuIds } = assignRolesMenuDTO
    const roles = await this.roleDomainService.getRolesByIds(ids, false, em)
    const menus = await this.menuDomainService.getMenusByIds(menuIds, false, em)
    await this.RoleMenuRepo.deleteMany(ids, 'role_id', em)
    const now = new Date()
    roles.forEach((r) => {
      r.menus = menus
      r.resources = []
      r.updatedBy = by
      r.updatedAt = now
    })
    return em.save(RoleEntity, roles)
  }
}
