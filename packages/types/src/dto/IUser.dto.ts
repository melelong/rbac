import type { SexEnum } from '../enums'
/** 创建用户接口参数校验 */
export interface ICreateUserDTO {
  /** 邮箱 */
  email?: string
  /** 电话号码 */
  phone?: string
  /** 用户名 */
  name: string
  /** 密码 */
  pwd: string
  /** 备注 */
  remark?: string
}

/** 更新用户接口参数校验 */
export interface IUpdateUserDTO {
  /** 用户名 */
  name?: string
  /** 别名 */
  nickName?: string
  /** 性别 */
  sex?: SexEnum
  /** 生日 */
  birthday?: Date
  /** 邮箱 */
  email?: string
  /** 电话号码 */
  phone?: string
  /** 头像 */
  avatar?: string
  /** 备注 */
  remark?: string
}
