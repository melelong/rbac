import type { CanActivate, ExecutionContext } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { BadRequestException, Injectable } from '@nestjs/common'
import { AuthBusiness, AuthBusinessTextMap, LoginTypeEnum } from '@packages/types'
import { Request } from 'express'
import { BusinessException } from '../exceptions'
import { EmailGuard } from './email.guard'
import { SvgGuard } from './svg.guard'

@Injectable()
export class UnifiedLoginGuard implements CanActivate {
  constructor(
    private readonly emailGuard: EmailGuard,
    private readonly svgGuard: SvgGuard,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.warn('UnifiedLoginGuard')
    const request = context.switchToHttp().getRequest() as Request
    const loginType = request.body.loginType as LoginTypeEnum
    if (!loginType) throw new BadRequestException('登录方式不能为空')

    let loginGuard: CanActivate

    switch (loginType) {
      case LoginTypeEnum.EMAIL: {
        loginGuard = this.emailGuard
        break
      }
      case LoginTypeEnum.SVG: {
        loginGuard = this.svgGuard
        break
      }
      default:
        throw new BusinessException(AuthBusiness.LOGIN_TYPE_NOT_SUPPORT, AuthBusinessTextMap)
    }
    return loginGuard.canActivate(context)
  }
}
