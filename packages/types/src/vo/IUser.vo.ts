import type { SexEnum } from '../enums'
import type { ICommonVO, IFindAllVO, IIdsVO } from './ICommon.vo'
// import type { IRoleDetailsVO } from './IRole.vo'

/** 用户档案 */
export interface IUserProfileVO {
  /** 别名 */
  nickName: string
  /** 性别 */
  sex: SexEnum
  /** 生日 */
  birthday: Date | null
  /** 邮箱 */
  email: string | null
  /** 电话号码 */
  phone: string | null
  /** 头像 */
  avatar: string
}
/** 用户详情 */
export interface IUserDetailsVO extends ICommonVO {
  /** 用户名 */
  name: string
  /** 用户档案 */
  profile: IUserProfileVO
  /** 角色列表 */
  // roles: IRoleDetailsVO[]
  /** 岗位 */
  // post: IPostDetailsVO | null
}

/** 分页查询用户详情列表 */
export interface IFindAllUserVO extends IFindAllVO<IUserDetailsVO> {}

/** 用户ID列表 */
export interface IUserIdsVO extends IIdsVO {}
