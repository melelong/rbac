/** 菜单类型枚举 */
export enum MenuTypeEnum {
  /** 菜单 */
  MENU = 10,
  /** 按钮 */
  BUTTON = 20,
  /** 组件 */
  COMPONENT = 30,
  /** 目录 */
  DIRECTORY = 40,
  /** 外链 */
  LINK = 50,
  /** 内链 */
  INNER_LINK = 60,
}

/** 菜单类型枚举文本映射 */
export const MenuTypeTextMap: Record<MenuTypeEnum, string> = {
  [MenuTypeEnum.MENU]: '菜单',
  [MenuTypeEnum.BUTTON]: '按钮',
  [MenuTypeEnum.DIRECTORY]: '目录',
  [MenuTypeEnum.COMPONENT]: '组件',
  [MenuTypeEnum.LINK]: '外链',
  [MenuTypeEnum.INNER_LINK]: '内链',
}

/** 菜单类型枚举编码映射 */
export const MenuTypeCodeMap: Record<MenuTypeEnum, string> = {
  [MenuTypeEnum.MENU]: 'MENU',
  [MenuTypeEnum.BUTTON]: 'BUTTON',
  [MenuTypeEnum.DIRECTORY]: 'DIRECTORY',
  [MenuTypeEnum.COMPONENT]: 'COMPONENT',
  [MenuTypeEnum.LINK]: 'LINK',
  [MenuTypeEnum.INNER_LINK]: 'INNER_LINK',
}
