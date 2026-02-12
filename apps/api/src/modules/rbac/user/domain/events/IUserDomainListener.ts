import type { UserCreatedEvent, UserDeletedEvent, UserUpdatedEvent, UserViewedEvent } from '../events'

/** 用户领域事件监听器接口 */
export interface IUserDomainListener {
  // 基本
  created: (event: UserCreatedEvent) => Promise<any>
  viewed: (event: UserViewedEvent) => Promise<any>
  updated: (event: UserUpdatedEvent) => Promise<any>
  deleted: (event: UserDeletedEvent) => Promise<any>
  // 特有
}
