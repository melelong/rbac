import type { AuthCreatedEvent, AuthDeletedEvent, AuthUpdatedEvent, AuthViewedEvent } from '../events'
import type { IAuthDomainListener } from './IAuthDomainListener'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { LogContextMethod } from '@/common/deco'
import { LoggingService } from '@/common/infra'

/** 认证领域事件枚举 */
export enum AuthDomainEvent {
  CREATED = 'AUTH.CREATED',
  VIEWED = 'AUTH.VIEWED',
  UPDATED = 'AUTH.UPDATED',
  DELETED = 'AUTH.DELETED',
}

/** 认证领域事件监听器实现 */
@Injectable()
export class AuthDomainListener implements IAuthDomainListener {
  constructor(private readonly loggingService: LoggingService) {}

  @OnEvent(AuthDomainEvent.CREATED)
  @LogContextMethod()
  async created(_event: AuthCreatedEvent) {
    this.loggingService.debug('删除缓存')
  }

  @OnEvent(AuthDomainEvent.VIEWED)
  @LogContextMethod()
  async viewed(_event: AuthViewedEvent) {
    this.loggingService.debug('读取缓存')
  }

  @OnEvent(AuthDomainEvent.UPDATED)
  @LogContextMethod()
  async updated(_event: AuthUpdatedEvent) {
    this.loggingService.debug('删除缓存')
  }

  @OnEvent(AuthDomainEvent.DELETED)
  @LogContextMethod()
  async deleted(_event: AuthDeletedEvent) {
    this.loggingService.debug('删除缓存')
  }
}
