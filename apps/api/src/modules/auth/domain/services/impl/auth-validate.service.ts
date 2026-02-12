import type { EntityManager } from 'typeorm'
import type { IAuthValidateService } from '../IAuthValidateService'
import { Injectable } from '@nestjs/common'
import { LogContextClass } from '@/common/deco'
import { BusinessException, ExceptionCode, ExceptionCodeTextMap } from '@/common/exceptions'
import { AuthRepository } from '../../../infra/repo'

/** 认证校验服务实现 */
@Injectable()
@LogContextClass()
export class AuthValidateService implements IAuthValidateService {
  constructor(private readonly authRepo: AuthRepository) {}

  async validateId(idList: string[], expectExists: boolean = true, em?: EntityManager) {
    const exists = await this.authRepo.existsById(idList, em)
    // 验证不存在
    if (!expectExists && exists) throw new BusinessException(ExceptionCode.AUTH_ALREADY_EXISTS, ExceptionCodeTextMap)
    // 验证存在
    if (expectExists && !exists) throw new BusinessException(ExceptionCode.AUTH_NOT_FOUND, ExceptionCodeTextMap)
  }

  async validateName(nameList: string[], expectExists: boolean = true, em?: EntityManager) {
    const exists = await this.authRepo.existsByName(nameList, em)
    // 验证不存在
    if (!expectExists && exists) throw new BusinessException(ExceptionCode.AUTH_NAME_ALREADY_EXISTS, ExceptionCodeTextMap)
    // 验证存在
    if (expectExists && !exists) throw new BusinessException(ExceptionCode.AUTH_NAME_NOT_FOUND, ExceptionCodeTextMap)
  }
}
