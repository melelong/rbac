import type { CreatePermissionDTO, PermissionCodeDTO, PermissionIdDTO, PermissionNameDTO } from './dto'
import type { IPermissionService } from './IPermission'
import type { FindAllDTO, UpdateStatusDTO } from '@/common/dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ActionTypeTextMap, PermissionBusiness, PermissionBusinessTextMap } from '@packages/types'
import { EntityManager, Repository } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { BusinessException } from '@/common/exceptions'
import { PermissionEntity } from './entities/permission.entity'
import { FindAllPermissionVO, PermissionVO } from './vo'

@Injectable()
export class PermissionService implements IPermissionService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async create(createPermissionDTO: CreatePermissionDTO, by: string = SYSTEM_DEFAULT_BY) {
    return this.entityManager.transaction(async (entityManager) => {
      const { name, domain, actionType, remark } = createPermissionDTO

      const [hasName, hasCode] = await Promise.all([
        entityManager.findOne(PermissionEntity, { where: { name }, lock: { mode: 'pessimistic_write' } }),
        entityManager.findOne(PermissionEntity, {
          where: { permissionCode: `${domain}:${ActionTypeTextMap[actionType]}` },
          lock: { mode: 'pessimistic_write' },
        }),
      ])
      if (hasName) throw new BusinessException(PermissionBusiness.NAME_ALREADY_EXISTS, PermissionBusinessTextMap)
      if (hasCode) throw new BusinessException(PermissionBusiness.CODE_ALREADY_EXISTS, PermissionBusinessTextMap)

      // 创建权限
      const now = new Date()
      const newPermission = entityManager.create(PermissionEntity, {
        name,
        domain,
        actionType,
        remark,
        createdBy: by,
        createdAt: now,
        updatedBy: by,
        updatedAt: now,
      })
      const permission = await entityManager.save(PermissionEntity, newPermission)

      const VO = new PermissionVO(permission)
      return VO
    })
  }

  async delById(permissionIdDTO: PermissionIdDTO, by?: string) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { id } = permissionIdDTO
      const now = new Date()
      const permission = await entityManager.findOne(PermissionEntity, { where: { id }, lock: { mode: 'pessimistic_write' } })
      if (!permission) throw new BusinessException(PermissionBusiness.NOT_FOUND, PermissionBusinessTextMap)

      await entityManager.update(PermissionEntity, { id }, { deletedBy: by, deletedAt: now })

      return true
    })
  }

  findAll(findAllDTO: FindAllDTO, isVO: true): Promise<FindAllPermissionVO>
  findAll(findAllDTO: FindAllDTO, isVO: false): Promise<[PermissionEntity[], number]>
  findAll(findAllDTO: FindAllDTO): Promise<FindAllPermissionVO>
  async findAll(findAllDTO: FindAllDTO, isVO: boolean = true) {
    let { limit = 10, page = 1 } = findAllDTO
    limit = +limit
    page = +page
    const skip = (page - 1) * limit
    const [data, total] = await this.permissionRepository.findAndCount({ skip, take: limit, order: { createdAt: 'DESC' } })
    if (isVO) {
      const VO = new FindAllPermissionVO({ DataConstructor: PermissionVO, data, limit, page, total })
      return VO
    }
    return [data, total]
  }

  findOneById(permissionIdDTO: PermissionIdDTO, isVO: true): Promise<PermissionVO>
  findOneById(permissionIdDTO: PermissionIdDTO, isVO: false): Promise<PermissionEntity>
  findOneById(permissionIdDTO: PermissionIdDTO): Promise<PermissionVO>
  async findOneById(permissionIdDTO: PermissionIdDTO, isVO: boolean = true) {
    const { id } = permissionIdDTO
    const permission = await this.permissionRepository.findOne({ where: { id } })
    if (!permission) throw new BusinessException(PermissionBusiness.NOT_FOUND, PermissionBusinessTextMap)
    if (isVO) {
      const VO = new PermissionVO(permission)
      return VO
    }
    return permission
  }

  findOneByName(permissionNameDTO: PermissionNameDTO, isVO: true): Promise<PermissionVO>
  findOneByName(permissionNameDTO: PermissionNameDTO, isVO: false): Promise<PermissionEntity>
  findOneByName(permissionNameDTO: PermissionNameDTO): Promise<PermissionVO>
  async findOneByName(permissionNameDTO: PermissionNameDTO, isVO: boolean = true) {
    const { name } = permissionNameDTO
    const permission = await this.permissionRepository.findOne({ where: { name } })
    if (!permission) throw new BusinessException(PermissionBusiness.NOT_FOUND, PermissionBusinessTextMap)
    if (isVO) {
      const VO = new PermissionVO(permission)
      return VO
    }
    return permission
  }

  findOneByCode(permissionCodeDTO: PermissionCodeDTO, isVO: true): Promise<PermissionVO>
  findOneByCode(permissionCodeDTO: PermissionCodeDTO, isVO: false): Promise<PermissionEntity>
  findOneByCode(permissionCodeDTO: PermissionCodeDTO): Promise<PermissionVO>
  async findOneByCode(permissionCodeDTO: PermissionCodeDTO, isVO: boolean = true) {
    const { permissionCode } = permissionCodeDTO
    const permission = await this.permissionRepository.findOne({ where: { permissionCode } })
    if (!permission) throw new BusinessException(PermissionBusiness.NOT_FOUND, PermissionBusinessTextMap)
    if (isVO) {
      const VO = new PermissionVO(permission)
      return VO
    }
    return permission
  }

  async updateStatusById(permissionIdDTO: PermissionIdDTO, updateStatusDTO: UpdateStatusDTO, by: string = SYSTEM_DEFAULT_BY) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { id } = permissionIdDTO
      const { status } = updateStatusDTO

      const permission = await entityManager.findOne(PermissionEntity, { where: { id }, lock: { mode: 'pessimistic_write' } })

      if (!permission) throw new BusinessException(PermissionBusiness.NOT_FOUND, PermissionBusinessTextMap)

      const now = new Date()
      await entityManager.update(PermissionEntity, { id }, { status, updatedBy: by, updatedAt: now })

      return true
    })
  }
}
