import type { MenuCreatedEvent, MenuDeletedEvent, MenuUpdatedEvent, MenuViewedEvent } from '../events'

/** 菜单领域事件监听器接口 */
export interface IMenuDomainListener {
  // 基本
  created: (event: MenuCreatedEvent) => Promise<any>
  viewed: (event: MenuViewedEvent) => Promise<any>
  updated: (event: MenuUpdatedEvent) => Promise<any>
  deleted: (event: MenuDeletedEvent) => Promise<any>
  // 特有
}
