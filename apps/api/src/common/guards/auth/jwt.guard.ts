import type { ExecutionContext } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { Inject, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY, LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra/logging'

/** jwt守卫 */
@Injectable()
@LogContextClass()
export class JwtGuard extends AuthGuard('jwt') {
  @Inject(LoggingService)
  private readonly loggingService: LoggingService

  @Inject(Reflector)
  private reflector: Reflector

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 看有没有用公共接口装饰器
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
    this.loggingService.debug(JwtGuard.name)
    this.loggingService.debug(isPublic ? '是公共接口' : '不是公共接口')
    return isPublic || super.canActivate(context)
  }
}
