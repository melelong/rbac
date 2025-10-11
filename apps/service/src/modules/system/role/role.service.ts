import type { AssignPermissionsByCodesDTO, AssignPermissionsByIdsDTO, CreateRoleDTO, RoleCodeDTO, RoleIdDTO, RoleNameDTO } from './dto'
import type { IRoleService } from './IRole'
import type { FindAllDTO, UpdateStatusDTO } from '@/common/dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoleBusiness, RoleBusinessTextMap } from '@packages/types'
import { EntityManager, In, Repository } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { BusinessException } from '@/common/exceptions'
import { BusinessTemplate } from '@/common/template'
import { Cache2Service } from '@/infrastructure/cache2/cache2.service'
import { PermissionEntity } from '../permission/entities/permission.entity'
import { RoleEntity } from './entities/role.entity'
import { DEFAULT_ROLES, SYS_ROLE_PERMISSION } from './role.constant'
import { CreateRoleStrategy } from './strategys'
import { FindAllRoleVO, RoleVO } from './vo'

@Injectable()
export class RoleService extends BusinessTemplate implements IRoleService {
  constructor(
    readonly entityManager: EntityManager,
    readonly cacheService: Cache2Service,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {
    super({ className: RoleService.name })
  }

  async create(createRoleDTO: CreateRoleDTO, by: string = SYSTEM_DEFAULT_BY) {
    const strategy = new CreateRoleStrategy({ createRoleDTO, by })
    return this.executionTransactionTemplateStrategy(strategy)
  }

  async delById(roleIdDTO: RoleIdDTO, _by: string = SYSTEM_DEFAULT_BY) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { id } = roleIdDTO
      // const now = new Date()
      const role = await entityManager.findOne(RoleEntity, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
        relations: ['ancestorNodes', 'descendantNodes'],
      })
      if (!role) throw new BusinessException(RoleBusiness.NOT_FOUND, RoleBusinessTextMap)

      if (
        role.roleCode === DEFAULT_ROLES.SUPER_ADMIN.roleCode ||
        role.roleCode === DEFAULT_ROLES.ADMIN.roleCode ||
        role.roleCode === DEFAULT_ROLES.USER.roleCode
      ) {
        throw new BusinessException(RoleBusiness.CANNOT_DELETE_BUILT_IN_ROLE, RoleBusinessTextMap)
      }

      console.warn(role)

      // await Promise.all([
      //   entityManager.update(RoleEntity, { id }, { deletedAt: now, deletedBy: by }),
      //   // 删除相关的关系记录
      //   entityManager.createQueryBuilder().delete().from(SYS_USER_ROLE).where('role_id = :roleId', { roleId: id }).execute(),
      //   entityManager.createQueryBuilder().delete().from(SYS_ROLE_PERMISSION).where('role_id = :roleId', { roleId: id }).execute(),
      //   entityManager.createQueryBuilder().delete().from(SYS_ROLE_DEPT).where('role_id = :roleId', { roleId: id }).execute(),
      // ])

      return true
    })
  }

  findAll(findAllDTO: FindAllDTO, isVO: true): Promise<FindAllRoleVO>
  findAll(findAllDTO: FindAllDTO, isVO: false): Promise<[RoleEntity[], number]>
  findAll(findAllDTO: FindAllDTO): Promise<FindAllRoleVO>
  async findAll(findAllDTO: FindAllDTO, isVO: boolean = true) {
    let { limit = 10, page = 1 } = findAllDTO
    limit = +limit
    page = +page
    const skip = (page - 1) * limit
    const [data, total] = await this.roleRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['ancestorNodes', 'descendantNodes'],
    })
    return isVO ? new FindAllRoleVO({ DataConstructor: RoleVO, data, limit, page, total }) : [data, total]
  }

  findOneById(roleIdDTO: RoleIdDTO, isVO: true): Promise<RoleVO>
  findOneById(roleIdDTO: RoleIdDTO, isVO: false): Promise<RoleEntity>
  findOneById(roleIdDTO: RoleIdDTO): Promise<RoleVO>
  async findOneById(roleIdDTO: RoleIdDTO, isVO: boolean = true) {
    const { id } = roleIdDTO
    const role = await this.roleRepository.findOne({ where: { id }, relations: ['ancestorNodes', 'descendantNodes'] })
    if (!role) throw new BusinessException(RoleBusiness.NOT_FOUND, RoleBusinessTextMap)
    return isVO ? new RoleVO(role) : role
  }

  findOneByName(roleNameDTO: RoleNameDTO, isVO: true): Promise<RoleVO>
  findOneByName(roleNameDTO: RoleNameDTO, isVO: false): Promise<RoleEntity>
  findOneByName(roleNameDTO: RoleNameDTO): Promise<RoleVO>
  async findOneByName(roleNameDTO: RoleNameDTO, isVO: boolean = true) {
    const { name } = roleNameDTO
    const role = await this.roleRepository.findOne({ where: { name }, relations: ['ancestorNodes', 'descendantNodes'] })
    if (!role) throw new BusinessException(RoleBusiness.NOT_FOUND, RoleBusinessTextMap)
    return isVO ? new RoleVO(role) : role
  }

  findOneByCode(roleCodeDTO: RoleCodeDTO, isVO: true): Promise<RoleVO>
  findOneByCode(roleCodeDTO: RoleCodeDTO, isVO: false): Promise<RoleEntity>
  findOneByCode(roleCodeDTO: RoleCodeDTO): Promise<RoleVO>
  async findOneByCode(roleCodeDTO: RoleCodeDTO, isVO: boolean = true) {
    const { roleCode } = roleCodeDTO
    const role = await this.roleRepository.findOne({ where: { roleCode }, relations: ['ancestorNodes', 'descendantNodes'] })
    if (!role) throw new BusinessException(RoleBusiness.NOT_FOUND, RoleBusinessTextMap)
    return isVO ? new RoleVO(role) : role
  }

  async updateStatusById(roleIdDTO: RoleIdDTO, updateStatusDTO: UpdateStatusDTO, by: string = SYSTEM_DEFAULT_BY) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { id } = roleIdDTO
      const { status } = updateStatusDTO

      const role = await entityManager.findOne(RoleEntity, { where: { id }, lock: { mode: 'pessimistic_write' } })

      if (!role) throw new BusinessException(RoleBusiness.NOT_FOUND, RoleBusinessTextMap)

      const now = new Date()
      await entityManager.update(RoleEntity, { id }, { status, updatedBy: by, updatedAt: now })

      return true
    })
  }

  async assignPermissionsByIds(assignPermissionsByIdsDTO: AssignPermissionsByIdsDTO, by: string = SYSTEM_DEFAULT_BY) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { id, permissionIds } = assignPermissionsByIdsDTO

      const role = await entityManager.findOne(RoleEntity, { where: { id }, lock: { mode: 'pessimistic_write' } })

      if (!role) throw new BusinessException(RoleBusiness.NOT_FOUND, RoleBusinessTextMap)

      const permissions = await entityManager.findBy(PermissionEntity, { id: In(permissionIds) })

      if (permissions.length !== permissionIds.length) throw new BusinessException(RoleBusiness.PERMISSION_NOT_FOUND, RoleBusinessTextMap)

      // 清空角色和权限的关系
      await entityManager.createQueryBuilder().delete().from(SYS_ROLE_PERMISSION).where('role_id = :roleId', { roleId: id }).execute()

      const now = new Date()
      role.permissions = permissions
      role.updatedAt = now
      role.updatedBy = by
      await entityManager.save(RoleEntity, role)
      return true
    })
  }

  async assignPermissionsByCodes(assignPermissionsByCodesDTO: AssignPermissionsByCodesDTO, by: string = SYSTEM_DEFAULT_BY) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { id, permissionCodes } = assignPermissionsByCodesDTO

      const role = await entityManager.findOne(RoleEntity, { where: { id }, lock: { mode: 'pessimistic_write' } })

      if (!role) throw new BusinessException(RoleBusiness.NOT_FOUND, RoleBusinessTextMap)

      const permissions = await entityManager.findBy(PermissionEntity, { permissionCode: In(permissionCodes) })

      if (permissions.length !== permissionCodes.length) throw new BusinessException(RoleBusiness.PERMISSION_NOT_FOUND, RoleBusinessTextMap)

      // 清空角色和权限的关系
      await entityManager.createQueryBuilder().delete().from(SYS_ROLE_PERMISSION).where('user_id = :userId', { userId: id }).execute()

      const now = new Date()
      role.permissions = permissions
      role.updatedAt = now
      role.updatedBy = by
      await entityManager.save(RoleEntity, role)
      return true
    })
  }
}
