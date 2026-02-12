import type { ExecutionContext } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { Inject, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra/logging'

/** SVG登录守卫 */
@Injectable()
@LogContextClass()
export class SvgLoginGuard extends AuthGuard('svg-login') {
  @Inject(LoggingService)
  private readonly loggingService: LoggingService

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    this.loggingService.debug(SvgLoginGuard.name)
    return super.canActivate(context)
  }
}
