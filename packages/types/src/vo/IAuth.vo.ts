import type { ICommonVO, IFindAllVO, IIdsVO } from './ICommon.vo'
import type { IUserDetailsVO, IUserProfileVO } from './IUser.vo'

/** 用户信息 */
export interface IUserInfo {
  /** 用户ID */
  id: string
  /** 登录IP */
  loginIp: string | null
  /** 登录时间 */
  loginAt: Date | null
}

/** 令牌详情 */
export interface ITokenVO {
  /** 访问令牌 */
  accessToken: string
  /** 刷新令牌 */
  refreshToken?: string
}

/** svg验证码接口响应数据 */
export interface ISvgCaptchaVO {
  /** 验证码凭证 */
  token: string
  /** svg验证码 */
  svg: string
}

/** 当前登录用户信息 */
export interface IMeInfoVO extends IUserDetailsVO {
  /** 用户名 */
  name: string
  /** 用户档案 */
  profile: IUserProfileVO
  /** 角色编码 */
  roles: string[]
  /** 菜单编码 */
  menus: string[]
}

/** 认证详情 */
export interface IAuthDetailsVO extends ICommonVO {
  /** 认证名 */
  name: string
}

/** 分页查询认证详情列表 */
export interface IFindAllAuthVO extends IFindAllVO<IAuthDetailsVO> {}

/** 认证ID列表 */
export interface IAuthIdsVO extends IIdsVO {}
