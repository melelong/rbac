import type { EntityManager } from 'typeorm'
import type { IResourceValidateService } from '../IResourceValidateService'
import { Injectable } from '@nestjs/common'
import { LogContextClass } from '@/common/deco'
import { BusinessException, ExceptionCode, ExceptionCodeTextMap } from '@/common/exceptions'
import { ResourceRepository } from '../../../infra/repo'

/** 资源校验服务实现 */
@Injectable()
@LogContextClass()
export class ResourceValidateService implements IResourceValidateService {
  constructor(private readonly resourceRepo: ResourceRepository) {}
  async validateId(idList: string[], expectExists: boolean = true, em?: EntityManager) {
    const exists = await this.resourceRepo.existsById(idList, em)
    // 验证不存在
    if (!expectExists && exists) throw new BusinessException(ExceptionCode.RESOURCE_ALREADY_EXISTS, ExceptionCodeTextMap)
    // 验证存在
    if (expectExists && !exists) throw new BusinessException(ExceptionCode.RESOURCE_NOT_FOUND, ExceptionCodeTextMap)
  }

  async validateName(nameList: string[], expectExists: boolean = true, em?: EntityManager) {
    const exists = await this.resourceRepo.existsByName(nameList, em)
    // 验证不存在
    if (!expectExists && exists) throw new BusinessException(ExceptionCode.RESOURCE_NAME_ALREADY_EXISTS, ExceptionCodeTextMap)
    // 验证存在
    if (expectExists && !exists) throw new BusinessException(ExceptionCode.RESOURCE_NAME_NOT_FOUND, ExceptionCodeTextMap)
  }

  async validateCode(codeList: string[], expectExists: boolean = true, em?: EntityManager) {
    const exists = await this.resourceRepo.existsByCode(codeList, em)
    // 验证不存在
    if (!expectExists && exists) throw new BusinessException(ExceptionCode.RESOURCE_CODE_ALREADY_EXISTS, ExceptionCodeTextMap)
    // 验证存在
    if (expectExists && !exists) throw new BusinessException(ExceptionCode.RESOURCE_CODE_NOT_FOUND, ExceptionCodeTextMap)
  }
}
