import * as process from 'node:process'

/** 应用进程ID */
export const APP_PID = process.pid
/** 数据库没有库存时给redis的值 */
export const DB_NULL = 'N'
/** UUID v4 长度 */
export const UUID_V4_LENGTH = 36
/** 系统默认操作者 */
export const SYSTEM_DEFAULT_BY = 'system'
/** 系统默认备注 */
export const SYSTEM_DEFAULT_REMARK = SYSTEM_DEFAULT_BY
/** 系统异常消息 */
export const SYSTEM_EXCEPTION_MSG = '系统异常，请稍后重试或者联系系统管理员'
// 备注相关
/** 备注 key */
export const REMARK = '备注'
/** 备注最小长度 */
export const REMARK_MIN = 1
/** 备注最大长度 */
export const REMARK_MAX = 500
// 邮箱相关
export const EMAIL = '邮箱'
export const EMAIL_MAX = 191
// 头像相关
export const AVATAR = '头像地址'
// 性别相关
export const SEX = '性别'
// 出生日期相关
export const BIRTHDAY = '出生日期'
// 电话号码相关
export const PHONE = '电话号码'
export const PHONE_MAX = 11
// 别名相关
/** 别名 key */
export const NICK_NAME = '别名'
/** 别名最小长度 */
export const NICK_NAME_MIN = 2
/** 别名最大长度 */
export const NICK_NAME_MAX = 64
// URL地址相关
export const URL = 'URL地址'
/** URL地址最小长度 */
export const URL_MIN = 10
/** URL地址最大长度 */
export const URL_MAX = 2048
// 编码相关
/** 编码 key */
export const CODE = '编码'
/** 编码最小长度 */
export const CODE_MIN = 2
/** 编码最大长度 */
export const CODE_MAX = 191
// 密码相关
/** 确认密码 key */
export const CONFIRM_PWD = '确认密码'
/** 密码 key */
export const PWD = '密码'
/** 密码最小长度 */
export const PWD_MIN = 8
/** 密码最大长度 */
export const PWD_MAX = 64
// 验证码相关
/** 验证码 key */
export const CAPTCHA = '验证码'
/** 验证码长度 */
export const CAPTCHA_LENGTH = 6
/** 验证码令牌 key */
export const CAPTCHA_TOKEN = '验证码令牌'
/** 验证码令牌长度 */
export const CAPTCHA_TOKEN_LENGTH = UUID_V4_LENGTH
/** 刷新令牌 key */
export const REFRESH_TOKEN = '刷新令牌'
/** 刷新令牌长度 */
export const REFRESH_TOKEN_LENGTH = 271
// 树相关
export const TREE_DEPTH = '树深度'
/** 命令成功 */
export const COMMAND_VO = '操作成功' as const
