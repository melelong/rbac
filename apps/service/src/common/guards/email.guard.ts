import type { ExecutionContext } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { AuthGuard } from '@nestjs/passport'

export class EmailGuard extends AuthGuard('Email') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.warn('EmailGuard')
    return super.canActivate(context)
  }
}
