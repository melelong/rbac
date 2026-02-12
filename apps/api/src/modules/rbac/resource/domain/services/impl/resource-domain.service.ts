import type { CreateResourceDTO, UpdateResourceDTO } from '../../../app'
import type { IResourceDomainService } from '../IResourceDomainService'
import type { FindAllDTO, UpdateSortDTO, UpdateStatusDTO } from '@/common/dto'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ResourceTypeCodeMap } from '@packages/types'
import { isUndefined } from 'lodash-es'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextClass } from '@/common/deco'
import { BusinessException, ExceptionCode, ExceptionCodeTextMap } from '@/common/exceptions'
import { uuid_v4 } from '@/common/utils'
import { ResourceRepository } from '../../../infra/repo'
import { ResourceEntity } from '../../entities'
import { ResourceValidateService } from './resource-validate.service'

/** 资源领域服务实现 */
@Injectable()
@LogContextClass()
export class ResourceDomainService implements IResourceDomainService {
  columns: string[]
  constructor(
    private readonly resourceRepo: ResourceRepository,
    private readonly validateService: ResourceValidateService,
    private readonly configService: ConfigService,
  ) {
    // 获取表字段名
    this.columns = this.resourceRepo.metadata.columns.map((c) => c.propertyName)
  }

  async createResources(em: EntityManager, createDTOList: CreateResourceDTO[], by: string = SYSTEM_DEFAULT_BY) {
    const nameList: string[] = []
    const codeList: string[] = []
    const createList: ResourceEntity[] = []
    const now = new Date()
    const base = { createdBy: by, createdAt: now, updatedBy: by, updatedAt: now }
    for (let i = 0, len = createDTOList.length; i < len; i++) {
      const { name, resourceType, domain, method } = createDTOList[i]
      const resourceCode = `${ResourceTypeCodeMap[resourceType]}:${domain}:${method}`
      nameList.push(name)
      codeList.push(resourceCode)
      // 资源
      const id = uuid_v4()
      createList.push(em.create(ResourceEntity, { ...createDTOList[i], ...base, id, resourceCode }))
    }
    await Promise.all([this.validateService.validateName(nameList, false, em), this.validateService.validateCode(codeList, false, em)])
    const resources = await this.resourceRepo.addMany(createList, by, em)
    return resources
  }

  async deleteResources(em: EntityManager, idList: string[], by: string = SYSTEM_DEFAULT_BY) {
    const resources = await this.getResourcesByIds(idList, false, em)
    // 删除资源
    await Promise.all([this.resourceRepo.deleteMany(resources, by, em)])
    return true
  }

  async updateResources(em: EntityManager, idList: string[], updateDTOList: UpdateResourceDTO[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== updateDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const resources = await this.getResourcesByIds(idList, false, em)
    const nameList: string[] = []
    const codeList: string[] = []
    for (let i = 0, len = resources.length; i < len; i++) {
      const DTO = updateDTOList[i]
      const resource = resources[i]
      const { name, resourceType, domain, method, remark } = DTO
      let resourceCode: string | null = null
      if (name) nameList.push(name)
      const key = `${resourceType ? '1' : '0'}${domain ? '1' : '0'}${method ? '1' : '0'}`
      const pick = {
        resourceType: key[0] === '1' ? ResourceTypeCodeMap[resourceType!] : resource.resourceType,
        domain: key[1] === '1' ? domain : resource.domain,
        method: key[2] === '1' ? method : resource.method,
      }
      if (key !== '000') {
        resourceCode = `${pick.resourceType}:${pick.domain}:${pick.method}`
        codeList.push(resourceCode)
      }
      // 与表字段名对比
      let hasData = false
      for (const [k, v] of Object.entries(DTO)) {
        if (isUndefined(v)) continue
        hasData = true
        if (this.columns.includes(k)) (resource as any)[k] = v
      }
      if (resourceCode) resource.resourceCode = resourceCode
      if (remark) resource.remark = remark
      // 没有修改数据
      if (!hasData) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    }
    await Promise.all([
      nameList.length > 0 ? this.validateService.validateName(nameList, false, em) : null,
      codeList.length > 0 ? this.validateService.validateCode(codeList, false, em) : null,
    ])
    await Promise.all([this.resourceRepo.patch(resources, by, em)])
    return true
  }

  async updateResourcesStatus(em: EntityManager, idList: string[], updateStatusDTOList: UpdateStatusDTO[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== updateStatusDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const resources = await this.getResourcesByIds(idList, false, em)
    for (let i = 0, len = resources.length; i < len; i++) {
      const updateStatusDTO = updateStatusDTOList[i]
      const resource = resources[i]
      resource.status = updateStatusDTO.status
    }
    await Promise.all([this.resourceRepo.patch(resources, by, em)])
    return true
  }

  async updateResourcesSort(em: EntityManager, idList: string[], updateSortDTOList: UpdateSortDTO[], by: string = SYSTEM_DEFAULT_BY) {
    // id列表和更新列表数量不一致
    if (idList.length !== updateSortDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const resources = await this.getResourcesByIds(idList, false, em)
    for (let i = 0, len = resources.length; i < len; i++) {
      const updateSortDTO = updateSortDTOList[i]
      const resource = resources[i]
      resource.sort = updateSortDTO.sort
    }
    await Promise.all([this.resourceRepo.patch(resources, by, em)])
    return true
  }

  async getResources(findAllDTO: FindAllDTO, relations: boolean = false, em?: EntityManager) {
    return this.resourceRepo.findAll(findAllDTO, relations, em)
  }

  async getResourcesByIds(idList: string[], relations: boolean = false, em?: EntityManager) {
    const resources = await this.resourceRepo.findManyById(idList, relations, em)
    if (idList.length !== resources.length) throw new BusinessException(ExceptionCode.RESOURCE_NOT_FOUND, ExceptionCodeTextMap)
    return resources
  }

  async getResourcesByNames(nameList: string[], relations: boolean = false, em?: EntityManager) {
    const resources = await this.resourceRepo.findManyByName(nameList, relations, em)
    if (nameList.length !== resources.length) throw new BusinessException(ExceptionCode.RESOURCE_NOT_FOUND, ExceptionCodeTextMap)
    return resources
  }

  async getResourcesByCodes(resourceCodeList: string[], em?: EntityManager) {
    const resources = await this.resourceRepo.findManyByCode(resourceCodeList, false, em)
    if (resourceCodeList.length !== resources.length) throw new BusinessException(ExceptionCode.RESOURCE_NOT_FOUND, ExceptionCodeTextMap)
    return resources
  }
}
