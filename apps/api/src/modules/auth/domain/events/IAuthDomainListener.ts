import type { AuthCreatedEvent, AuthDeletedEvent, AuthUpdatedEvent, AuthViewedEvent } from '../events'

/** 认证领域事件监听器接口 */
export interface IAuthDomainListener {
  // 基本
  created: (event: AuthCreatedEvent) => Promise<any>
  viewed: (event: AuthViewedEvent) => Promise<any>
  updated: (event: AuthUpdatedEvent) => Promise<any>
  deleted: (event: AuthDeletedEvent) => Promise<any>
  // 特有
}
