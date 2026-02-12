import type { ExecutionContext } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { Inject, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra/logging'

/** 邮箱注册守卫 */
@Injectable()
@LogContextClass()
export class EmailRegisterGuard extends AuthGuard('email-register') {
  @Inject(LoggingService)
  private readonly loggingService: LoggingService

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    this.loggingService.debug(EmailRegisterGuard.name)
    return super.canActivate(context)
  }
}
