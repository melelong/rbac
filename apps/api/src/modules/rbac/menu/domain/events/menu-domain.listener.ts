import type { MenuCreatedEvent, MenuDeletedEvent, MenuUpdatedEvent, MenuViewedEvent } from '../events'
import type { IMenuDomainListener } from './IMenuDomainListener'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { LogContextMethod } from '@/common/deco'
import { LoggingService } from '@/common/infra'

/** 菜单领域事件枚举 */
export enum MenuDomainEvent {
  CREATED = 'MENU.CREATED',
  VIEWED = 'MENU.VIEWED',
  UPDATED = 'MENU.UPDATED',
  DELETED = 'MENU.DELETED',
}

/** 菜单领域事件监听器实现 */
@Injectable()
export class MenuDomainListener implements IMenuDomainListener {
  constructor(private readonly loggingService: LoggingService) {}

  @OnEvent(MenuDomainEvent.CREATED)
  @LogContextMethod()
  async created(_event: MenuCreatedEvent) {
    this.loggingService.debug('删除缓存')
  }

  @OnEvent(MenuDomainEvent.VIEWED)
  @LogContextMethod()
  async viewed(_event: MenuViewedEvent) {
    this.loggingService.debug('读取缓存')
  }

  @OnEvent(MenuDomainEvent.UPDATED)
  @LogContextMethod()
  async updated(_event: MenuUpdatedEvent) {
    this.loggingService.debug('删除缓存')
  }

  @OnEvent(MenuDomainEvent.DELETED)
  @LogContextMethod()
  async deleted(_event: MenuDeletedEvent) {
    this.loggingService.debug('删除缓存')
  }
}
