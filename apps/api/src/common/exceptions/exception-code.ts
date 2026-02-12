import { HttpStatus } from '@packages/types'
/** 异常码枚举 */
export enum ExceptionCode {
  // 公共
  /** 请输入修改项 */
  COMMON_PROMPT_FOR_MODIFICATION = 'COMMON_0000',
  /** 不能移动到自己 */
  COMMON_CANNOT_MOVE_TO_SELF = 'COMMON_0001',
  /** 不能移动到子节点 */
  COMMON_CANNOT_MOVE_TO_CHILD = 'COMMON_0002',
  /** 请求过于频繁，请稍后再试 */
  COMMON_TOO_MANY_REQUESTS = 'COMMON_0003',
  /** 令牌已失效，请重新登录 */
  COMMON_UNAUTHORIZED = 'COMMON_0004',
  /** 无权限访问该资源 */
  COMMON_FORBIDDEN = 'COMMON_0005',
  /** 未找到该资源 */
  COMMON_NOT_FOUND = 'COMMON_0006',
  /** 系统异常，请稍后重试或者联系系统管理员 */
  COMMON_INTERNAL_SERVER_ERROR = 'COMMON_0007',
  /** 服务不可用，请稍后重试或者联系系统管理员 */
  COMMON_SERVICE_UNAVAILABLE = 'COMMON_0008',
  // 缓存
  /** 未提供队列实例 */
  CACHE_NO_QUEUE_INSTANCE_PROVIDED = 'CACHE_0000',
  /** 缓存服务异常 */
  CACHE_SERVICE_ERROR = 'CACHE_0001',
  /** 获取分布式锁失败 */
  CACHE_LOCK_ACQUIRE_FAILED = 'CACHE_0002',
  // 节流器
  /** 节流器服务异常 */
  THROTTLER_SERVICE_ERROR = 'THROTTLER_0000',
  // 队列
  /** 队列服务异常 */
  QUEUE_SERVICE_ERROR = 'QUEUE_0000',
  // 授权
  /** 验证码错误 */
  AUTH_CODE_INVALID = 'AUTH_0004',
  /** 验证码已过期 */
  AUTH_CODE_EXPIRED = 'AUTH_0005',
  /** 发送验证码次数过多,请稍后重试 */
  AUTH_CAPTCHA_TOO_FREQUENT = 'AUTH_0006',
  /** 当前目标与验证目标不一致 */
  AUTH_TARGET_MISMATCH = 'AUTH_0007',
  /** 密码错误 */
  AUTH_INCORRECT_PASSWORD = 'AUTH_0008',
  /** 登录类型不支持 */
  AUTH_LOGIN_TYPE_NOT_SUPPORT = 'AUTH_0009',
  // 菜单
  /** 菜单已存在 */
  MENU_ALREADY_EXISTS = 'MENU_0000',
  /** 菜单不存在 */
  MENU_NOT_FOUND = 'MENU_0001',
  /** 菜单名已存在 */
  MENU_NAME_ALREADY_EXISTS = 'MENU_0002',
  /** 菜单名不存在 */
  MENU_NAME_NOT_FOUND = 'MENU_0003',
  /** 菜单编码已存在 */
  MENU_CODE_ALREADY_EXISTS = 'MENU_0004',
  /** 菜单编码不存在 */
  MENU_CODE_NOT_FOUND = 'MENU_0005',
  /** 不能删除内置菜单 */
  MENU_BUILT_IN_CANNOT_DELETE = 'MENU_0006',
  // 资源
  /** 资源已存在 */
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_0000',
  /** 资源不存在 */
  RESOURCE_NOT_FOUND = 'RESOURCE_0001',
  /** 资源名已存在 */
  RESOURCE_NAME_ALREADY_EXISTS = 'RESOURCE_0002',
  /** 资源名不存在 */
  RESOURCE_NAME_NOT_FOUND = 'RESOURCE_0003',
  /** 资源编码已存在 */
  RESOURCE_CODE_ALREADY_EXISTS = 'RESOURCE_0004',
  /** 资源编码不存在 */
  RESOURCE_CODE_NOT_FOUND = 'RESOURCE_0005',
  /** 不能删除内置资源 */
  RESOURCE_BUILT_IN_CANNOT_DELETE = 'RESOURCE_0006',
  // 角色
  /** 角色已存在 */
  ROLE_ALREADY_EXISTS = 'ROLE_0000',
  /** 角色不存在 */
  ROLE_NOT_FOUND = 'ROLE_0001',
  /** 角色名已存在 */
  ROLE_NAME_ALREADY_EXISTS = 'ROLE_0002',
  /** 角色名不存在 */
  ROLE_NAME_NOT_FOUND = 'ROLE_0003',
  /** 角色编码已存在 */
  ROLE_CODE_ALREADY_EXISTS = 'ROLE_0004',
  /** 角色编码不存在 */
  ROLE_CODE_NOT_FOUND = 'ROLE_0005',
  /** 不能删除内置角色 */
  ROLE_BUILT_IN_CANNOT_DELETE = 'ROLE_0006',
  // 用户
  /** 用户已存在 */
  USER_ALREADY_EXISTS = 'USER_0000',
  /** 用户不存在 */
  USER_NOT_FOUND = 'USER_0001',
  /** 用户名已存在 */
  USER_NAME_ALREADY_EXISTS = 'USER_0002',
  /** 用户名不存在 */
  USER_NAME_NOT_FOUND = 'USER_0003',
  /** 用户邮箱已存在 */
  USER_EMAIL_ALREADY_EXISTS = 'USER_0004',
  /** 用户邮箱不存在 */
  USER_EMAIL_NOT_FOUND = 'USER_0005',
  /** 用户电话号码已存在 */
  USER_PHONE_ALREADY_EXISTS = 'USER_0006',
  /** 用户电话号码不存在 */
  USER_PHONE_NOT_FOUND = 'USER_0007',
  /** 不能删除内置用户 */
  USER_BUILT_IN_CANNOT_DELETE = 'USER_0008',
  // 部门
  /** 部门已存在 */
  DEPT_ALREADY_EXISTS = 'DEPT_0000',
  /** 部门不存在 */
  DEPT_NOT_FOUND = 'DEPT_0001',
  /** 部门名已存在 */
  DEPT_NAME_ALREADY_EXISTS = 'DEPT_0002',
  /** 部门名不存在 */
  DEPT_NAME_NOT_FOUND = 'DEPT_0003',
  /** 部门编码已存在 */
  DEPT_CODE_ALREADY_EXISTS = 'DEPT_0004',
  /** 部门编码不存在 */
  DEPT_CODE_NOT_FOUND = 'DEPT_0005',
  /** 不能删除内置部门 */
  DEPT_BUILT_IN_CANNOT_DELETE = 'DEPT_0006',
  // 岗位
  /** 岗位已存在 */
  POST_ALREADY_EXISTS = 'POST_0000',
  /** 岗位不存在 */
  POST_NOT_FOUND = 'POST_0001',
  /** 岗位名已存在 */
  POST_NAME_ALREADY_EXISTS = 'POST_0002',
  /** 岗位名不存在 */
  POST_NAME_NOT_FOUND = 'POST_0003',
  /** 岗位编码已存在 */
  POST_CODE_ALREADY_EXISTS = 'POST_0004',
  /** 岗位编码不存在 */
  POST_CODE_NOT_FOUND = 'POST_0005',
  /** 不能删除内置岗位 */
  POST_BUILT_IN_CANNOT_DELETE = 'POST_0006',
  // 认证
  /** 认证已存在 */
  AUTH_ALREADY_EXISTS = 'AUTH_0000',
  /** 认证不存在 */
  AUTH_NOT_FOUND = 'AUTH_0001',
  /** 认证名已存在 */
  AUTH_NAME_ALREADY_EXISTS = 'AUTH_0002',
  /** 认证名不存在 */
  AUTH_NAME_NOT_FOUND = 'AUTH_0003',
}

/** 异常码枚举文本映射 */
export const ExceptionCodeTextMap: Record<ExceptionCode, [string, number]> = {
  // 公共
  [ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION]: ['请输入修改项', HttpStatus.BAD_REQUEST],
  [ExceptionCode.COMMON_CANNOT_MOVE_TO_SELF]: ['不能移动到自己', HttpStatus.OK],
  [ExceptionCode.COMMON_CANNOT_MOVE_TO_CHILD]: ['不能移动到子节点', HttpStatus.OK],
  [ExceptionCode.COMMON_TOO_MANY_REQUESTS]: ['请求过于频繁，请稍后再试', HttpStatus.TOO_MANY_REQUESTS],
  [ExceptionCode.COMMON_UNAUTHORIZED]: ['令牌已失效，请重新登录', HttpStatus.UNAUTHORIZED],
  [ExceptionCode.COMMON_FORBIDDEN]: ['无权限访问该资源', HttpStatus.FORBIDDEN],
  [ExceptionCode.COMMON_NOT_FOUND]: ['未找到该资源', HttpStatus.NOT_FOUND],
  [ExceptionCode.COMMON_INTERNAL_SERVER_ERROR]: ['系统异常，请稍后重试或者联系系统管理员', HttpStatus.INTERNAL_SERVER_ERROR],
  [ExceptionCode.COMMON_SERVICE_UNAVAILABLE]: ['服务不可用，请稍后重试或者联系系统管理员', HttpStatus.SERVICE_UNAVAILABLE],
  // 缓存
  [ExceptionCode.CACHE_NO_QUEUE_INSTANCE_PROVIDED]: ['未提供队列实例', HttpStatus.INTERNAL_SERVER_ERROR],
  [ExceptionCode.CACHE_SERVICE_ERROR]: ['缓存服务异常', HttpStatus.INTERNAL_SERVER_ERROR],
  [ExceptionCode.CACHE_LOCK_ACQUIRE_FAILED]: ['获取分布式锁失败', HttpStatus.INTERNAL_SERVER_ERROR],
  // 节流器
  [ExceptionCode.THROTTLER_SERVICE_ERROR]: ['节流器服务异常', HttpStatus.INTERNAL_SERVER_ERROR],
  // 队列
  [ExceptionCode.QUEUE_SERVICE_ERROR]: ['队列服务异常', HttpStatus.INTERNAL_SERVER_ERROR],
  // 授权
  [ExceptionCode.AUTH_CODE_INVALID]: ['验证码错误', HttpStatus.BAD_REQUEST],
  [ExceptionCode.AUTH_CODE_EXPIRED]: ['验证码已过期', HttpStatus.BAD_REQUEST],
  [ExceptionCode.AUTH_CAPTCHA_TOO_FREQUENT]: ['发送验证码次数过多,请稍后重试', HttpStatus.OK],
  [ExceptionCode.AUTH_TARGET_MISMATCH]: ['当前目标与验证目标不一致', HttpStatus.BAD_REQUEST],
  [ExceptionCode.AUTH_INCORRECT_PASSWORD]: ['密码错误', HttpStatus.OK],
  [ExceptionCode.AUTH_LOGIN_TYPE_NOT_SUPPORT]: ['登录方式不支持', HttpStatus.BAD_REQUEST],
  // 菜单
  [ExceptionCode.MENU_ALREADY_EXISTS]: ['菜单已存在', HttpStatus.OK],
  [ExceptionCode.MENU_NOT_FOUND]: ['菜单不存在', HttpStatus.OK],
  [ExceptionCode.MENU_NAME_ALREADY_EXISTS]: ['菜单名已存在', HttpStatus.OK],
  [ExceptionCode.MENU_NAME_NOT_FOUND]: ['菜单名不存在', HttpStatus.OK],
  [ExceptionCode.MENU_CODE_ALREADY_EXISTS]: ['菜单编码已存在', HttpStatus.OK],
  [ExceptionCode.MENU_CODE_NOT_FOUND]: ['菜单编码不存在', HttpStatus.OK],
  [ExceptionCode.MENU_BUILT_IN_CANNOT_DELETE]: ['不能删除内置菜单', HttpStatus.OK],
  // 资源
  [ExceptionCode.RESOURCE_ALREADY_EXISTS]: ['资源已存在', HttpStatus.OK],
  [ExceptionCode.RESOURCE_NOT_FOUND]: ['资源不存在', HttpStatus.OK],
  [ExceptionCode.RESOURCE_NAME_ALREADY_EXISTS]: ['资源名已存在', HttpStatus.OK],
  [ExceptionCode.RESOURCE_NAME_NOT_FOUND]: ['资源名不存在', HttpStatus.OK],
  [ExceptionCode.RESOURCE_CODE_ALREADY_EXISTS]: ['资源编码已存在', HttpStatus.OK],
  [ExceptionCode.RESOURCE_CODE_NOT_FOUND]: ['资源编码不存在', HttpStatus.OK],
  [ExceptionCode.RESOURCE_BUILT_IN_CANNOT_DELETE]: ['不能删除内置资源', HttpStatus.OK],
  // 角色
  [ExceptionCode.ROLE_ALREADY_EXISTS]: ['角色已存在', HttpStatus.OK],
  [ExceptionCode.ROLE_NOT_FOUND]: ['角色不存在', HttpStatus.OK],
  [ExceptionCode.ROLE_NAME_ALREADY_EXISTS]: ['角色名已存在', HttpStatus.OK],
  [ExceptionCode.ROLE_NAME_NOT_FOUND]: ['角色名不存在', HttpStatus.OK],
  [ExceptionCode.ROLE_CODE_ALREADY_EXISTS]: ['角色编码已存在', HttpStatus.OK],
  [ExceptionCode.ROLE_CODE_NOT_FOUND]: ['角色编码不存在', HttpStatus.OK],
  [ExceptionCode.ROLE_BUILT_IN_CANNOT_DELETE]: ['不能删除内置角色', HttpStatus.OK],
  // 用户
  [ExceptionCode.USER_ALREADY_EXISTS]: ['用户已存在', HttpStatus.OK],
  [ExceptionCode.USER_NOT_FOUND]: ['用户不存在', HttpStatus.OK],
  [ExceptionCode.USER_NAME_ALREADY_EXISTS]: ['用户名已存在', HttpStatus.OK],
  [ExceptionCode.USER_NAME_NOT_FOUND]: ['用户名不存在', HttpStatus.OK],
  [ExceptionCode.USER_EMAIL_ALREADY_EXISTS]: ['用户邮箱已存在', HttpStatus.OK],
  [ExceptionCode.USER_EMAIL_NOT_FOUND]: ['用户邮箱不存在', HttpStatus.OK],
  [ExceptionCode.USER_PHONE_ALREADY_EXISTS]: ['用户电话号码已存在', HttpStatus.OK],
  [ExceptionCode.USER_PHONE_NOT_FOUND]: ['用户电话号码不存在', HttpStatus.OK],
  [ExceptionCode.USER_BUILT_IN_CANNOT_DELETE]: ['不能删除内置用户', HttpStatus.OK],
  // 部门
  [ExceptionCode.DEPT_ALREADY_EXISTS]: ['部门已存在', HttpStatus.OK],
  [ExceptionCode.DEPT_NOT_FOUND]: ['部门不存在', HttpStatus.OK],
  [ExceptionCode.DEPT_NAME_ALREADY_EXISTS]: ['部门名已存在', HttpStatus.OK],
  [ExceptionCode.DEPT_NAME_NOT_FOUND]: ['部门名不存在', HttpStatus.OK],
  [ExceptionCode.DEPT_CODE_ALREADY_EXISTS]: ['部门编码已存在', HttpStatus.OK],
  [ExceptionCode.DEPT_CODE_NOT_FOUND]: ['部门编码不存在', HttpStatus.OK],
  [ExceptionCode.DEPT_BUILT_IN_CANNOT_DELETE]: ['不能删除内置部门', HttpStatus.OK],
  // 岗位
  [ExceptionCode.POST_ALREADY_EXISTS]: ['岗位已存在', HttpStatus.OK],
  [ExceptionCode.POST_NOT_FOUND]: ['岗位不存在', HttpStatus.OK],
  [ExceptionCode.POST_NAME_ALREADY_EXISTS]: ['岗位名已存在', HttpStatus.OK],
  [ExceptionCode.POST_NAME_NOT_FOUND]: ['岗位名不存在', HttpStatus.OK],
  [ExceptionCode.POST_CODE_ALREADY_EXISTS]: ['岗位编码已存在', HttpStatus.OK],
  [ExceptionCode.POST_CODE_NOT_FOUND]: ['岗位编码不存在', HttpStatus.OK],
  [ExceptionCode.POST_BUILT_IN_CANNOT_DELETE]: ['不能删除内置岗位', HttpStatus.OK],
  // 认证
  [ExceptionCode.AUTH_ALREADY_EXISTS]: ['认证已存在', HttpStatus.CONFLICT],
  [ExceptionCode.AUTH_NOT_FOUND]: ['认证不存在', HttpStatus.NOT_FOUND],
  [ExceptionCode.AUTH_NAME_ALREADY_EXISTS]: ['认证名已存在', HttpStatus.CONFLICT],
  [ExceptionCode.AUTH_NAME_NOT_FOUND]: ['认证名不存在', HttpStatus.NOT_FOUND],
}
