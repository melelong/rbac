import type { IUserProfileEntity } from './IUserProfileEntity'
import type { ICommonEntity } from '@/common/entities'
import type { IRoleEntity } from '@/modules/rbac/role/domain'
/** 用户表实体接口 */
export interface IUserEntity extends ICommonEntity {
  /** 用户名 */
  name: string
  /** 密码 */
  pwd?: string
  /** 最后登录的IP */
  loginIp: string | null
  /** 最后登录时间 */
  loginAt: Date | null
  /** 密码最后更新时间 */
  pwdUpdateAt: Date | null
  /** 密码最后更新者 */
  pwdUpdateBy: string | null
  /** 盐值 */
  salt?: string
  /** 插入前生成盐值 */
  generateSalt: () => void

  /** 用户1-1档案 */
  profile: IUserProfileEntity
  /** 用户1-N第三方平台绑定 */
  // oauth2Binds: IOAuth2UserBindEntity[]
  /** 用户N-N角色 */
  roles: IRoleEntity[]
  /** 用户N-1岗位 */
  // post: IPostEntity | null
}
