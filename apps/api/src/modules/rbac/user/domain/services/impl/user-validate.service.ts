import type { EntityManager } from 'typeorm'
import type { IUserValidateService } from '../IUserValidateService'
import { Injectable } from '@nestjs/common'
import { LogContextClass } from '@/common/deco'
import { BusinessException, ExceptionCode, ExceptionCodeTextMap } from '@/common/exceptions'
import { UserRepository } from '../../../infra/repo'

/** 用户校验服务实现 */
@Injectable()
@LogContextClass()
export class UserValidateService implements IUserValidateService {
  constructor(private readonly userRepo: UserRepository) {}
  async validateId(idList: string[], expectExists: boolean = true, em?: EntityManager) {
    const exists = await this.userRepo.existsById(idList, em)
    // 验证不存在
    if (!expectExists && exists) throw new BusinessException(ExceptionCode.USER_ALREADY_EXISTS, ExceptionCodeTextMap)
    // 验证存在
    if (expectExists && !exists) throw new BusinessException(ExceptionCode.USER_NOT_FOUND, ExceptionCodeTextMap)
  }

  async validateName(nameList: string[], expectExists: boolean = true, em?: EntityManager) {
    const exists = await this.userRepo.existsByName(nameList, em)
    // 验证不存在
    if (!expectExists && exists) throw new BusinessException(ExceptionCode.USER_NAME_ALREADY_EXISTS, ExceptionCodeTextMap)
    // 验证存在
    if (expectExists && !exists) throw new BusinessException(ExceptionCode.USER_NAME_NOT_FOUND, ExceptionCodeTextMap)
  }

  async validateEmail(emailList: string[], expectExists: boolean = true, em?: EntityManager) {
    const exists = await this.userRepo.existsByEmail(emailList, em)
    // 验证不存在
    if (!expectExists && exists) throw new BusinessException(ExceptionCode.USER_EMAIL_ALREADY_EXISTS, ExceptionCodeTextMap)
    // 验证存在
    if (expectExists && !exists) throw new BusinessException(ExceptionCode.USER_EMAIL_NOT_FOUND, ExceptionCodeTextMap)
  }

  async validatePhone(phoneList: string[], expectExists: boolean = true, em?: EntityManager) {
    const exists = await this.userRepo.existsByPhone(phoneList, em)
    // 验证不存在
    if (!expectExists && exists) throw new BusinessException(ExceptionCode.USER_PHONE_ALREADY_EXISTS, ExceptionCodeTextMap)
    // 验证存在
    if (expectExists && !exists) throw new BusinessException(ExceptionCode.USER_PHONE_NOT_FOUND, ExceptionCodeTextMap)
  }
}
