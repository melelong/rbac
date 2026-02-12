import type { UserCreatedEvent, UserDeletedEvent, UserUpdatedEvent, UserViewedEvent } from '../events'
import type { IUserDomainListener } from './IUserDomainListener'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { LogContextMethod } from '@/common/deco'
import { LoggingService } from '@/common/infra'

/** 用户领域事件枚举 */
export enum UserDomainEvent {
  CREATED = 'USER.CREATED',
  VIEWED = 'USER.VIEWED',
  UPDATED = 'USER.UPDATED',
  DELETED = 'USER.DELETED',
}

/** 用户领域事件监听器实现 */
@Injectable()
export class UserDomainListener implements IUserDomainListener {
  constructor(private readonly loggingService: LoggingService) {}

  @OnEvent(UserDomainEvent.CREATED)
  @LogContextMethod()
  async created(_event: UserCreatedEvent) {
    this.loggingService.debug('删除缓存')
  }

  @OnEvent(UserDomainEvent.VIEWED)
  @LogContextMethod()
  async viewed(_event: UserViewedEvent) {
    this.loggingService.debug('读取缓存')
  }

  @OnEvent(UserDomainEvent.UPDATED)
  @LogContextMethod()
  async updated(_event: UserUpdatedEvent) {
    this.loggingService.debug('删除缓存')
  }

  @OnEvent(UserDomainEvent.DELETED)
  @LogContextMethod()
  async deleted(_event: UserDeletedEvent) {
    this.loggingService.debug('删除缓存')
  }
}
