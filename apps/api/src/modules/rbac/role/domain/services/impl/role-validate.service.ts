import type { EntityManager } from 'typeorm'
import type { IRoleValidateService } from '../IRoleValidateService'
import { Injectable } from '@nestjs/common'
import { LogContextClass } from '@/common/deco'
import { BusinessException, ExceptionCode, ExceptionCodeTextMap } from '@/common/exceptions'
import { RoleRepository } from '../../../infra/repo'

/** 角色校验服务实现 */
@Injectable()
@LogContextClass()
export class RoleValidateService implements IRoleValidateService {
  constructor(private readonly roleRepo: RoleRepository) {}
  async validateId(idList: string[], expectExists: boolean = true, em?: EntityManager) {
    const exists = await this.roleRepo.existsById(idList, em)
    // 验证不存在
    if (!expectExists && exists) throw new BusinessException(ExceptionCode.ROLE_ALREADY_EXISTS, ExceptionCodeTextMap)
    // 验证存在
    if (expectExists && !exists) throw new BusinessException(ExceptionCode.ROLE_NOT_FOUND, ExceptionCodeTextMap)
  }

  async validateName(nameList: string[], expectExists: boolean = true, em?: EntityManager) {
    const exists = await this.roleRepo.existsByName(nameList, em)
    // 验证不存在
    if (!expectExists && exists) throw new BusinessException(ExceptionCode.ROLE_NAME_ALREADY_EXISTS, ExceptionCodeTextMap)
    // 验证存在
    if (expectExists && !exists) throw new BusinessException(ExceptionCode.ROLE_NAME_NOT_FOUND, ExceptionCodeTextMap)
  }

  async validateCode(codeList: string[], expectExists: boolean = true, em?: EntityManager) {
    const exists = await this.roleRepo.existsByCode(codeList, em)
    // 验证不存在
    if (!expectExists && exists) throw new BusinessException(ExceptionCode.ROLE_CODE_ALREADY_EXISTS, ExceptionCodeTextMap)
    // 验证存在
    if (expectExists && !exists) throw new BusinessException(ExceptionCode.ROLE_CODE_NOT_FOUND, ExceptionCodeTextMap)
  }
}
