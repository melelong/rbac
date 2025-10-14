export interface IOtherLoginItem {
  /** 图标 */
  icon: string
  /** 标题 */
  title: string
  /** 点击事件 */
  onClick: (...args: Array<any>) => any
}
export interface IOtherLoginProps {
  items: Array<IOtherLoginItem>
}
