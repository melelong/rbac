export interface IBoot {
  /** 初始化 */
  init: () => Promise<void>
  /** 监听 */
  listen: () => Promise<void>
  /** 启用热重载 */
  enableHotReload: () => void
}
