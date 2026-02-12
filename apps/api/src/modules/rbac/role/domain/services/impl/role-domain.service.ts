import type { CreateRoleDTO, UpdateRoleDTO } from '../../../app'
import type { IRoleDomainService } from '../IRoleDomainService'
import type { FindAllDTO, UpdateSortDTO, UpdateStatusDTO } from '@/common/dto'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { isUndefined } from 'lodash-es'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextClass } from '@/common/deco'
import { BusinessException, ExceptionCode, ExceptionCodeTextMap } from '@/common/exceptions'
import { uuid_v4 } from '@/common/utils'
import { RoleRepository, RoleTreeRepository } from '../../../infra/repo'
import { RoleEntity } from '../../entities'
import { RoleValidateService } from './role-validate.service'

/** 角色领域服务实现 */
@Injectable()
@LogContextClass()
export class RoleDomainService implements IRoleDomainService {
  columns: string[]
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly treeRepo: RoleTreeRepository,
    private readonly validateService: RoleValidateService,
    private readonly configService: ConfigService,
  ) {
    // 获取表字段名
    this.columns = this.roleRepo.metadata.columns.map((c) => c.propertyName)
  }

  async createRoles(em: EntityManager, createDTOList: CreateRoleDTO[], by: string = SYSTEM_DEFAULT_BY) {
    const nameList: string[] = []
    const codeList: string[] = []
    const parentIdList: string[] = []
    const createList: RoleEntity[] = []
    const now = new Date()
    const base = { createdBy: by, createdAt: now, updatedBy: by, updatedAt: now }
    for (let i = 0, len = createDTOList.length; i < len; i++) {
      const { name, roleCode, parentId } = createDTOList[i]
      nameList.push(name)
      codeList.push(roleCode)
      if (parentId) parentIdList.push(parentId)
      // 角色
      const id = uuid_v4()
      createList.push(em.create(RoleEntity, { ...createDTOList[i], ...base, id }))
      // 角色树
      await this.treeRepo.addClosureNode(id, em, parentId)
    }
    await Promise.all([
      this.validateService.validateName(nameList, false, em),
      this.validateService.validateCode(codeList, false, em),
      parentIdList.length > 0 ? this.validateService.validateId(parentIdList, true, em) : null,
    ])
    const roles = await this.roleRepo.addMany(createList, by, em)
    return roles
  }

  async deleteRoles(em: EntityManager, idList: string[], by: string = SYSTEM_DEFAULT_BY, deleteDescendant: boolean = false) {
    const roles = await this.getRolesByIds(idList, false, em)
    const ids: string[] = []
    for (let i = 0, len = roles.length; i < len; i++) {
      const id = idList[i]
      // 删除角色树相关记录(包括后代)
      const descendantRelations = await this.treeRepo.deleteClosureNodeCascade(id, em)
      ids.push(...descendantRelations.map((item) => item.descendantId))
    }
    const patchList = await this.getRolesByIds([...new Set(ids)], false, em)
    patchList.forEach((item) => (item.parentId = null))
    // 删除角色
    await Promise.all([
      this.roleRepo.deleteMany(roles, by, em),
      // 删除后代节点 或 后代节点变游离节点(父节点变null)
      deleteDescendant ? this.roleRepo.deleteMany(patchList, by, em) : this.roleRepo.patch(patchList, by, em),
    ])
    return true
  }

  async updateRoles(em: EntityManager, idList: string[], updateDTOList: UpdateRoleDTO[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== updateDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const roles = await this.getRolesByIds(idList, false, em)
    const nameList: string[] = []
    const codeList: string[] = []
    for (let i = 0, len = roles.length; i < len; i++) {
      const DTO = updateDTOList[i]
      const role = roles[i]
      const { name, roleCode, remark } = DTO
      if (name) nameList.push(name)
      if (roleCode) codeList.push(roleCode)
      // 与表字段名对比
      let hasData = false
      for (const [k, v] of Object.entries(DTO)) {
        if (isUndefined(v)) continue
        hasData = true
        if (this.columns.includes(k)) (role as any)[k] = v
      }
      if (remark) role.remark = remark
      // 没有修改数据
      if (!hasData) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    }
    await Promise.all([
      nameList.length > 0 ? this.validateService.validateName(nameList, false, em) : null,
      codeList.length > 0 ? this.validateService.validateCode(codeList, false, em) : null,
    ])
    await Promise.all([this.roleRepo.patch(roles, by, em)])
    return true
  }

  async updateRolesStatus(em: EntityManager, idList: string[], updateStatusDTOList: UpdateStatusDTO[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== updateStatusDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const roles = await this.getRolesByIds(idList, false, em)
    for (let i = 0, len = roles.length; i < len; i++) {
      const updateStatusDTO = updateStatusDTOList[i]
      const role = roles[i]
      role.status = updateStatusDTO.status
    }
    await Promise.all([this.roleRepo.patch(roles, by, em)])
    return true
  }

  async updateRolesSort(em: EntityManager, idList: string[], updateSortDTOList: UpdateSortDTO[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== updateSortDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const roles = await this.getRolesByIds(idList, false, em)
    for (let i = 0, len = roles.length; i < len; i++) {
      const updateSortDTO = updateSortDTOList[i]
      const role = roles[i]
      role.sort = updateSortDTO.sort
    }
    await Promise.all([this.roleRepo.patch(roles, by, em)])
    return true
  }

  async getRoles(findAllDTO: FindAllDTO, relations: boolean = false, em?: EntityManager) {
    return this.roleRepo.findAll(findAllDTO, relations, em)
  }

  async getRolesByIds(idList: string[], relations: boolean = false, em?: EntityManager) {
    const roles = await this.roleRepo.findManyById(idList, relations, em)
    if (idList.length !== roles.length) throw new BusinessException(ExceptionCode.ROLE_NOT_FOUND, ExceptionCodeTextMap)
    return roles
  }

  async getRolesByNames(nameList: string[], relations: boolean = false, em?: EntityManager) {
    const roles = await this.roleRepo.findManyByName(nameList, relations, em)
    if (nameList.length !== roles.length) throw new BusinessException(ExceptionCode.ROLE_NOT_FOUND, ExceptionCodeTextMap)
    return roles
  }

  async moveRoles(em: EntityManager, idList: string[], parentIdList: (string | null)[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== parentIdList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const ids: Set<string> = new Set<string>()
    for (let i = 0, len = idList.length; i < len; i++) {
      const id = idList[i]
      const parentId = parentIdList[i]
      if (id === parentId) throw new BusinessException(ExceptionCode.COMMON_CANNOT_MOVE_TO_SELF, ExceptionCodeTextMap)
      if (parentId) {
        const isDescendant = await this.treeRepo.isDescendant(id, parentId, em)
        if (isDescendant) throw new BusinessException(ExceptionCode.COMMON_CANNOT_MOVE_TO_CHILD, ExceptionCodeTextMap)
        ids.add(parentId)
      }
      ids.add(id)
    }
    await this.validateService.validateId([...ids], true, em)
    const roles = await this.getRolesByIds(idList, false, em)
    roles.forEach((item, i) => (item.parentId = parentIdList[i]))
    for (let i = 0, len = idList.length; i < len; i++) {
      const id = idList[i]
      const parentId = parentIdList[i]
      await this.treeRepo.moveTree(id, parentId, em)
    }
    await this.roleRepo.patch(roles, by, em)
    const _roles = await this.getRolesByIds(idList, false, em)
    return _roles
  }

  async getRoleTreesByIds<VO = any>(idList: string[], VOConstructor: new (...args: any[]) => VO, depth: number = -1, em?: EntityManager) {
    if (idList.length <= 0) return []
    await this.validateService.validateId(idList, true, em)
    const descendantIds = await this.treeRepo.getTreeDescendantIds(idList, depth, em)
    // 所有后代节点
    const roles = await this.getRolesByIds(descendantIds, false, em)
    return await this.treeRepo.buildTree<RoleEntity, VO>(idList, roles, VOConstructor)
  }

  async getRolesByCodes(roleCodeList: string[], relations: boolean = false, em?: EntityManager) {
    const roles = await this.roleRepo.findManyByCode(roleCodeList, relations, em)
    if (roleCodeList.length !== roles.length) throw new BusinessException(ExceptionCode.ROLE_NOT_FOUND, ExceptionCodeTextMap)
    return roles
  }
}
