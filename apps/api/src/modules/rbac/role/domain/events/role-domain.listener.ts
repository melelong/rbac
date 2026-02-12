import type { RoleCreatedEvent, RoleDeletedEvent, RoleUpdatedEvent, RoleViewedEvent } from '../events'
import type { IRoleDomainListener } from './IRoleDomainListener'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { LogContextMethod } from '@/common/deco'
import { LoggingService } from '@/common/infra'

/** 角色领域事件枚举 */
export enum RoleDomainEvent {
  CREATED = 'ROLE.CREATED',
  VIEWED = 'ROLE.VIEWED',
  UPDATED = 'ROLE.UPDATED',
  DELETED = 'ROLE.DELETED',
}

/** 角色领域事件监听器实现 */
@Injectable()
export class RoleDomainListener implements IRoleDomainListener {
  constructor(private readonly loggingService: LoggingService) {}

  @OnEvent(RoleDomainEvent.CREATED)
  @LogContextMethod()
  async created(_event: RoleCreatedEvent) {
    this.loggingService.debug('删除缓存')
  }

  @OnEvent(RoleDomainEvent.VIEWED)
  @LogContextMethod()
  async viewed(_event: RoleViewedEvent) {
    this.loggingService.debug('读取缓存')
  }

  @OnEvent(RoleDomainEvent.UPDATED)
  @LogContextMethod()
  async updated(_event: RoleUpdatedEvent) {
    this.loggingService.debug('删除缓存')
  }

  @OnEvent(RoleDomainEvent.DELETED)
  @LogContextMethod()
  async deleted(_event: RoleDeletedEvent) {
    this.loggingService.debug('删除缓存')
  }
}
