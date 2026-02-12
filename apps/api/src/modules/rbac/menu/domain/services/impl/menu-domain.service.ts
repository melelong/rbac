import type { CreateMenuDTO, UpdateMenuDTO } from '../../../app'
import type { IMenuDomainService } from '../IMenuDomainService'
import type { FindAllDTO, UpdateSortDTO, UpdateStatusDTO } from '@/common/dto'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MenuTypeCodeMap } from '@packages/types'
import { isUndefined } from 'lodash-es'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextClass } from '@/common/deco'
import { BusinessException, ExceptionCode, ExceptionCodeTextMap } from '@/common/exceptions'
import { uuid_v4 } from '@/common/utils'
import { MenuRepository, MenuTreeRepository } from '../../../infra/repo'
import { MenuEntity } from '../../entities'
import { MenuValidateService } from './menu-validate.service'

/** 菜单领域服务实现 */
@Injectable()
@LogContextClass()
export class MenuDomainService implements IMenuDomainService {
  columns: string[]
  constructor(
    private readonly menuRepo: MenuRepository,
    private readonly treeRepo: MenuTreeRepository,
    private readonly validateService: MenuValidateService,
    private readonly configService: ConfigService,
  ) {
    // 获取表字段名
    this.columns = this.menuRepo.metadata.columns.map((c) => c.propertyName)
  }

  async createMenus(em: EntityManager, createDTOList: CreateMenuDTO[], by: string = SYSTEM_DEFAULT_BY) {
    const nameList: string[] = []
    const codeList: string[] = []
    const parentIdList: string[] = []
    const createList: MenuEntity[] = []
    const now = new Date()
    const base = { createdBy: by, createdAt: now, updatedBy: by, updatedAt: now }
    for (let i = 0, len = createDTOList.length; i < len; i++) {
      const { name, menuType, domain, action, parentId } = createDTOList[i]
      const menuCode = `${MenuTypeCodeMap[menuType]}:${domain}:${action}`
      nameList.push(name)
      codeList.push(menuCode)
      if (parentId) parentIdList.push(parentId)
      // 菜单
      const id = uuid_v4()
      createList.push(em.create(MenuEntity, { ...createDTOList[i], ...base, id, menuCode }))
      // 菜单树
      await this.treeRepo.addClosureNode(id, em, parentId)
    }
    await Promise.all([
      this.validateService.validateName(nameList, false, em),
      parentIdList.length > 0 ? this.validateService.validateId(parentIdList, true, em) : null,
    ])
    const menus = await this.menuRepo.addMany(createList, by, em)
    return menus
  }

  async deleteMenus(em: EntityManager, idList: string[], by: string = SYSTEM_DEFAULT_BY, deleteDescendant: boolean = false) {
    const menus = await this.getMenusByIds(idList, false, em)
    const ids: string[] = []
    for (let i = 0, len = menus.length; i < len; i++) {
      const id = idList[i]
      // 删除角色树相关记录(包括后代)
      const descendantRelations = await this.treeRepo.deleteClosureNodeCascade(id, em)
      ids.push(...descendantRelations.map((item) => item.descendantId))
    }
    const patchList = await this.getMenusByIds([...new Set(ids)], false, em)
    patchList.forEach((item) => (item.parentId = null))
    // 删除菜单
    await Promise.all([
      this.menuRepo.deleteMany(menus, by, em),
      // 删除后代节点 或 后代节点变游离节点(父节点变null)
      deleteDescendant ? this.menuRepo.deleteMany(patchList, by, em) : this.menuRepo.patch(patchList, by, em),
    ])
    return true
  }

  async updateMenus(em: EntityManager, idList: string[], updateDTOList: UpdateMenuDTO[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== updateDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const menus = await this.getMenusByIds(idList, false, em)
    const nameList: string[] = []
    const codeList: string[] = []
    for (let i = 0, len = menus.length; i < len; i++) {
      const DTO = updateDTOList[i]
      const menu = menus[i]
      const { name, menuType, domain, action, remark } = DTO
      let menuCode: string | null = null
      if (name) nameList.push(name)
      const key = `${menuType ? '1' : '0'}${domain ? '1' : '0'}${action ? '1' : '0'}`
      const pick = {
        menuType: key[0] === '1' ? MenuTypeCodeMap[menuType!] : menu.menuType,
        domain: key[1] === '1' ? domain : menu.domain,
        action: key[2] === '1' ? action : menu.action,
      }
      if (key !== '000') {
        menuCode = `${pick.menuType}:${pick.domain}:${pick.action}`
        codeList.push(menuCode)
      }
      // 与表字段名对比
      let hasData = false
      for (const [k, v] of Object.entries(DTO)) {
        if (isUndefined(v)) continue
        hasData = true
        if (this.columns.includes(k)) (menu as any)[k] = v
      }
      if (menuCode) menu.menuCode = menuCode
      if (remark) menu.remark = remark
      // 没有修改数据
      if (!hasData) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    }
    await Promise.all([nameList.length > 0 ? this.validateService.validateName(nameList, false, em) : null])
    await Promise.all([this.menuRepo.patch(menus, by, em)])
    return true
  }

  async updateMenusStatus(em: EntityManager, idList: string[], updateStatusDTOList: UpdateStatusDTO[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== updateStatusDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const menus = await this.getMenusByIds(idList, false, em)
    for (let i = 0, len = menus.length; i < len; i++) {
      const updateStatusDTO = updateStatusDTOList[i]
      const menu = menus[i]
      menu.status = updateStatusDTO.status
    }
    await Promise.all([this.menuRepo.patch(menus, by, em)])
    return true
  }

  async updateMenusSort(em: EntityManager, idList: string[], updateSortDTOList: UpdateSortDTO[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== updateSortDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const menus = await this.getMenusByIds(idList, false, em)
    for (let i = 0, len = menus.length; i < len; i++) {
      const updateSortDTO = updateSortDTOList[i]
      const menu = menus[i]
      menu.sort = updateSortDTO.sort
    }
    await Promise.all([this.menuRepo.patch(menus, by, em)])
    return true
  }

  async getMenus(findAllDTO: FindAllDTO, relations: boolean = false, em?: EntityManager) {
    return this.menuRepo.findAll(findAllDTO, relations, em)
  }

  async getMenusByIds(idList: string[], relations: boolean = false, em?: EntityManager) {
    const menus = await this.menuRepo.findManyById(idList, relations, em)
    if (idList.length !== menus.length) throw new BusinessException(ExceptionCode.MENU_NOT_FOUND, ExceptionCodeTextMap)
    return menus
  }

  async getMenusByNames(nameList: string[], relations: boolean = false, em?: EntityManager) {
    const menus = await this.menuRepo.findManyByName(nameList, relations, em)
    if (nameList.length !== menus.length) throw new BusinessException(ExceptionCode.MENU_NOT_FOUND, ExceptionCodeTextMap)
    return menus
  }

  async moveMenus(em: EntityManager, idList: string[], parentIdList: (string | null)[], by: string = SYSTEM_DEFAULT_BY) {
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
    const menus = await this.getMenusByIds(idList, false, em)
    menus.forEach((item, i) => (item.parentId = parentIdList[i]))
    for (let i = 0, len = idList.length; i < len; i++) {
      const id = idList[i]
      const parentId = parentIdList[i]
      await this.treeRepo.moveTree(id, parentId, em)
    }
    await this.menuRepo.patch(menus, by, em)
    const _menus = await this.getMenusByIds(idList, false, em)
    return _menus
  }

  async getMenuTreesByIds<VO = any>(idList: string[], VOConstructor: new (...args: any[]) => VO, depth: number = -1, em?: EntityManager) {
    if (idList.length <= 0) return []
    await this.validateService.validateId(idList, true, em)
    const descendantIds = await this.treeRepo.getTreeDescendantIds(idList, depth, em)
    // 所有后代节点
    const menus = await this.getMenusByIds(descendantIds, false, em)
    return await this.treeRepo.buildTree<MenuEntity, VO>(idList, menus, VOConstructor)
  }
}
