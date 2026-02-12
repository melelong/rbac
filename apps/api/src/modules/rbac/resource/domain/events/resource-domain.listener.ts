import type { ResourceCreatedEvent, ResourceDeletedEvent, ResourceUpdatedEvent, ResourceViewedEvent } from '../events'
import type { IResourceDomainListener } from './IResourceDomainListener'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { LogContextMethod } from '@/common/deco'
import { LoggingService } from '@/common/infra'

/** 资源领域事件枚举 */
export enum ResourceDomainEvent {
  CREATED = 'RESOURCE.CREATED',
  VIEWED = 'RESOURCE.VIEWED',
  UPDATED = 'RESOURCE.UPDATED',
  DELETED = 'RESOURCE.DELETED',
}

/** 资源领域事件监听器实现 */
@Injectable()
export class ResourceDomainListener implements IResourceDomainListener {
  constructor(private readonly loggingService: LoggingService) {}

  @OnEvent(ResourceDomainEvent.CREATED)
  @LogContextMethod()
  async created(_event: ResourceCreatedEvent) {
    this.loggingService.debug('删除缓存')
  }

  @OnEvent(ResourceDomainEvent.VIEWED)
  @LogContextMethod()
  async viewed(_event: ResourceViewedEvent) {
    this.loggingService.debug('读取缓存')
  }

  @OnEvent(ResourceDomainEvent.UPDATED)
  @LogContextMethod()
  async updated(_event: ResourceUpdatedEvent) {
    this.loggingService.debug('删除缓存')
  }

  @OnEvent(ResourceDomainEvent.DELETED)
  @LogContextMethod()
  async deleted(_event: ResourceDeletedEvent) {
    this.loggingService.debug('删除缓存')
  }
}
