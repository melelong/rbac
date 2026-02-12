import type { ResourceCreatedEvent, ResourceDeletedEvent, ResourceUpdatedEvent, ResourceViewedEvent } from '../events'

/** 资源领域事件监听器接口 */
export interface IResourceDomainListener {
  // 基本
  created: (event: ResourceCreatedEvent) => Promise<any>
  viewed: (event: ResourceViewedEvent) => Promise<any>
  updated: (event: ResourceUpdatedEvent) => Promise<any>
  deleted: (event: ResourceDeletedEvent) => Promise<any>
  // 特有
}
