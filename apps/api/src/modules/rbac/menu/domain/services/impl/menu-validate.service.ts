import type { EntityManager } from 'typeorm'
import type { IMenuValidateService } from '../IMenuValidateService'
import { Injectable } from '@nestjs/common'
import { LogContextClass } from '@/common/deco'
import { BusinessException, ExceptionCode, ExceptionCodeTextMap } from '@/common/exceptions'
import { MenuRepository } from '../../../infra/repo'

/** 菜单校验服务实现 */
@Injectable()
@LogContextClass()
export class MenuValidateService implements IMenuValidateService {
  constructor(private readonly menuRepo: MenuRepository) {}
  async validateId(idList: string[], expectExists: boolean = true, em?: EntityManager) {
    const exists = await this.menuRepo.existsById(idList, em)
    // 验证不存在
    if (!expectExists && exists) throw new BusinessException(ExceptionCode.MENU_ALREADY_EXISTS, ExceptionCodeTextMap)
    // 验证存在
    if (expectExists && !exists) throw new BusinessException(ExceptionCode.MENU_NOT_FOUND, ExceptionCodeTextMap)
  }

  async validateName(nameList: string[], expectExists: boolean = true, em?: EntityManager) {
    const exists = await this.menuRepo.existsByName(nameList, em)
    // 验证不存在
    if (!expectExists && exists) throw new BusinessException(ExceptionCode.MENU_NAME_ALREADY_EXISTS, ExceptionCodeTextMap)
    // 验证存在
    if (expectExists && !exists) throw new BusinessException(ExceptionCode.MENU_NAME_NOT_FOUND, ExceptionCodeTextMap)
  }
}
