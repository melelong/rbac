/** 资源类型枚举 */
export enum ResourceTypeEnum {
  /** 接口 */
  API = 10,
  /** 静态资源 */
  STATIC_RESOURCE = 20,
  /** WebSocket连接点 */
  WEBSOCKET = 30,
  /** 定时任务 */
  SCHEDULED_TASK = 40,
  /** 数据权限 */
  DATA = 50,
}

/** 资源类型枚举文本映射 */
export const ResourceTypeTextMap: Record<ResourceTypeEnum, string> = {
  [ResourceTypeEnum.API]: '接口',
  [ResourceTypeEnum.STATIC_RESOURCE]: '静态资源',
  [ResourceTypeEnum.WEBSOCKET]: 'WebSocket连接点',
  [ResourceTypeEnum.SCHEDULED_TASK]: '定时任务',
  [ResourceTypeEnum.DATA]: '数据权限',
}

/** 资源类型枚举编码映射 */
export const ResourceTypeCodeMap: Record<ResourceTypeEnum, string> = {
  [ResourceTypeEnum.API]: 'API',
  [ResourceTypeEnum.STATIC_RESOURCE]: 'STATIC_RESOURCE',
  [ResourceTypeEnum.WEBSOCKET]: 'WEBSOCKET',
  [ResourceTypeEnum.SCHEDULED_TASK]: 'SCHEDULED_TASK',
  [ResourceTypeEnum.DATA]: 'DATA',
}
