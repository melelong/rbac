import type { EntityManager } from 'typeorm'
import type { AssignRolesResourceDTO, RoleIdsDTO } from '../../dto'
import type { IRoleResourceService } from '../IRoleResourceService'
import type { ResourceIdsDTO } from '@/modules/rbac/resource/app'
import { Injectable } from '@nestjs/common'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextClass } from '@/common/deco'
import { ResourceDomainService } from '@/modules/rbac/resource/domain'
import { RoleDomainService, RoleEntity } from '@/modules/rbac/role/domain'
import { RoleResourceRepository } from '../../../infra/repo'

/** 角色资源服务实现 */
@Injectable()
@LogContextClass()
export class RoleResourceService implements IRoleResourceService {
  constructor(
    private readonly roleDomainService: RoleDomainService,
    private readonly RoleResourceRepo: RoleResourceRepository,
    private readonly resourceDomainService: ResourceDomainService,
  ) {}

  async getResourceIdsByRoleIds(roleIds: RoleIdsDTO, em?: EntityManager) {
    const { ids } = roleIds
    return await this.roleDomainService.getRolesByIds(ids, false, em)
  }

  async getRoleIdsByResourceIds(resourceIds: ResourceIdsDTO, em?: EntityManager) {
    const { ids } = resourceIds
    return await this.resourceDomainService.getResourcesByIds(ids, false, em)
  }

  async assignRolesResourceByIds(em: EntityManager, assignRolesResourceDTO: AssignRolesResourceDTO, by: string = SYSTEM_DEFAULT_BY) {
    const { ids, resourceIds } = assignRolesResourceDTO
    const roles = await this.roleDomainService.getRolesByIds(ids, false, em)
    const resources = await this.resourceDomainService.getResourcesByIds(resourceIds, false, em)
    await this.RoleResourceRepo.deleteMany(ids, 'role_id', em)
    const now = new Date()
    roles.forEach((r) => {
      r.resources = resources
      r.menus = []
      r.updatedBy = by
      r.updatedAt = now
    })
    return em.save(RoleEntity, roles)
  }
}
