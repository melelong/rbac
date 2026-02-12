/** 角色ID key */
export const ROLE_ID = '角色ID'
/** 角色名 key */
export const ROLE_NAME = '角色名'
/** 角色名最小长度 */
export const ROLE_NAME_MIN = 2
/** 角色名最大长度 */
export const ROLE_NAME_MAX = 64
/** 角色编码 key */
export const ROLE_CODE = '角色编码'
/** 角色编码最小长度 */
export const ROLE_CODE_MIN = 2
/** 角色编码最大长度 */
export const ROLE_CODE_MAX = 64
/** 数据范围 key */
export const ROLE_DATA_SCOPE = '数据范围'

// 表名
/** 角色表名 */
export const ROLE_TABLE = 'role'
/** 角色树表名 */
export const ROLE_TREE_TABLE = 'role_tree'
/** 角色资源中间表名 */
export const ROLE_RESOURCE_TABLE = 'role_resource'
/** 角色菜单中间表名 */
export const ROLE_MENU_TABLE = 'role_menu'

/** 角色父ID key */
export const ROLE_PARENT_ID = '角色父ID'
/** 内置角色 */
export const DEFAULT_ROLES = {
  SUPER_ADMIN: {
    name: '超级管理员',
    roleCode: 'SUPER',
  },
  ADMIN: {
    name: '管理员',
    roleCode: 'ADMIN',
  },
  USER: {
    name: '普通用户',
    roleCode: 'USER',
  },
} as const
