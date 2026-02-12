import type { RoleCreatedEvent, RoleDeletedEvent, RoleUpdatedEvent, RoleViewedEvent } from '../events'

/** 角色领域事件监听器接口 */
export interface IRoleDomainListener {
  // 基本
  created: (event: RoleCreatedEvent) => Promise<any>
  viewed: (event: RoleViewedEvent) => Promise<any>
  updated: (event: RoleUpdatedEvent) => Promise<any>
  deleted: (event: RoleDeletedEvent) => Promise<any>
  // 特有
}
