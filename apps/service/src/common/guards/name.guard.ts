import type { ExecutionContext } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { AuthGuard } from '@nestjs/passport'

export class NameGuard extends AuthGuard('Name') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.warn('NameGuard')
    return super.canActivate(context)
  }
}
