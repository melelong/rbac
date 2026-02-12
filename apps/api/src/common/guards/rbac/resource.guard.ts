import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { LogContextClass, RESOURCE_DOMAIN_KEY, RESOURCE_METHOD_KEY, RESOURCE_TYPE_KEY } from '@/common/deco'
import { LoggingService } from '@/common/infra/logging'

/** 资源守卫 */
@Injectable()
@LogContextClass()
export class ResourceGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly loggingService: LoggingService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const typeCode = this.reflector.getAllAndOverride<string>(RESOURCE_TYPE_KEY, [context.getClass()])
    const domainCode = this.reflector.getAllAndOverride<string>(RESOURCE_DOMAIN_KEY, [context.getClass()])
    const methodCode = this.reflector.getAllAndOverride<string>(RESOURCE_METHOD_KEY, [context.getHandler()])
    if (!typeCode || !domainCode || !methodCode) return true
    const resourceCode = `${typeCode ? `${typeCode}:` : ''}${domainCode ? `${domainCode}:` : ''}${methodCode ? `${methodCode}` : ''}`
    this.loggingService.debug(resourceCode)
    return true
  }
}
