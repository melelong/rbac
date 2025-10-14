import type { SexEnum } from '@packages/types'
import type { RoleEntity } from '../role/entities/role.entity'
import type { AssignRolesByCodesDTO, AssignRolesByIdsDTO, CreateUserDTO, UpdateUserDTO, UserIdDTO } from './dto'
import type { UserEntity } from './entities/user.entity'
import type { UserProfileEntity } from './entities/userProfile.entity'
import type { FindAllUserVO, UserVO } from './vo'
import type { DEL_BY_ID_VO, UPDATE_STATUS_VO, UPDATE_VO } from '@/common/constants'
import type { FindAllDTO, UpdateStatusDTO } from '@/common/dto'
import type { ICommonEntity } from '@/common/entities/ICommonEntity'
import type { PostEntity } from '@/modules/system/post/entities/post.entity'

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
  profile: UserProfileEntity
  /** 用户N-N角色 */
  roles: RoleEntity[]
  /** 用户N-1岗位 */
  post: PostEntity | null
}

/** 用户档案表实体接口 */
export interface IUserProfileEntity extends ICommonEntity {
  /** 用户别名 */
  nickName: string
  /** 性别(10:女 20:男 30:未知 默认:30) */
  sex: SexEnum
  /** 出生日期 */
  birthday: Date | null
  /** 用户邮箱 */
  email: string | null
  /** 电话号码 */
  phone: string | null
  /** 头像地址 */
  avatar: string | null
  /** 档案1-1用户 */
  user: UserEntity
}

/** 用于兼容其他模块传来的参数 */
export interface CreateUserOptions extends CreateUserDTO {
  /** 邮箱 */
  email?: string
  /** 备注 */
  remark?: string
}

/** 用户模块服务接口 */
export interface IUserService {
  /**
   * 密码明文和密码密文对比
   * @param currentPwd 当前密码明文
   * @param userSalt 用户盐
   * @param encryptedPwd 密码密文
   */
  compare: (currentPwd: string, userSalt: string, encryptedPwd: string) => Promise<boolean>

  /**
   * 密码明文加密
   * @param pwd 密码明文
   * @param userSalt 用户盐
   */
  encryptPassword: (pwd: string, userSalt: string) => Promise<string>

  /**
   * 创建用户
   * @param createUserOptions 创建参数
   * @param by 操作者，默认system
   */
  create: (createUserOptions: CreateUserOptions, by?: string) => Promise<UserVO>

  /**
   * 根据用户ID删除用户
   * @param userIdDTO 用户ID
   * @param by 操作者，默认system
   */
  delById: (userIdDTO: UserIdDTO, by?: string) => Promise<boolean>

  /**
   * 分页查询所有用户
   * @param findAllDTO 查询参数
   * @param isVO 是否返回VO格式(默认:true)
   */
  findAll: ((findAllDTO: FindAllDTO, isVO: true) => Promise<FindAllUserVO>) &
    ((findAllDTO: FindAllDTO, isVO: false) => Promise<[UserEntity[], number]>) &
    ((findAllDTO: FindAllDTO) => Promise<FindAllUserVO>)

  /**
   * 根据用户ID查询单个用户
   * @param id 用户ID
   * @param isVO 是否返回VO格式(默认:true)
   */

  findOneById: ((id: string, isVO: true) => Promise<UserVO>) & ((id: string, isVO: false) => Promise<UserEntity>) & ((id: string) => Promise<UserVO>)

  /**
   * 根据用户名查询单个用户
   * @param name 用户名
   * @param isVO 是否返回VO格式(默认:true)
   */
  findOneByName: ((name: string, isVO: true) => Promise<UserVO>) &
    ((name: string, isVO: false) => Promise<UserEntity>) &
    ((name: string) => Promise<UserVO>)

  /**
   * 根据用户邮箱查询单个用户
   * @param email 用户邮箱
   * @param isVO 是否返回VO格式(默认:true)
   */
  findOneByEmail: ((email: string, isVO: true) => Promise<UserVO>) &
    ((email: string, isVO: false) => Promise<UserEntity>) &
    ((email: string) => Promise<UserVO>)

  /**
   * 根据用户ID更新单个用户
   * @param userIdDTO 用户ID
   * @param updateUserDTO 更新参数
   * @param by 操作者，默认system
   */
  update: (userIdDTO: UserIdDTO, updateUserDTO: UpdateUserDTO, by?: string) => Promise<boolean>

  /**
   * 更新登录记录
   * @param id 用户ID
   * @param loginAt 最后登录时间
   * @param loginIp 最后登录的IP
   */
  updateLoginInfo: (id: string, loginAt: Date, loginIp: string) => Promise<boolean>

  /**
   * 更新密码
   * @param id 用户ID
   * @param pwd 新密码明文
   * @param by 操作者，默认system
   */
  updatePwd: (id: string, pwd: string, by?: string) => Promise<boolean>

  /**
   * 更新状态
   * @param userIdDTO 用户ID
   * @param updateStatusDTO 更新状态参数
   * @param by 操作者，默认system
   */
  updateStatusById: (userIdDTO: UserIdDTO, updateStatusDTO: UpdateStatusDTO, by?: string) => Promise<boolean>

  /**
   * 根据角色ID分配角色
   * @param assignRolesByIdsDTO 分配角色参数
   * @param by 操作者，默认system
   */
  assignRolesByIds: (assignRolesByIdsDTO: AssignRolesByIdsDTO, by?: string) => Promise<boolean>

  /**
   * 根据角色编码分配角色
   * @param assignRolesByCodesDTO 分配角色参数
   * @param by 操作者，默认system
   */
  assignRolesByCodes: (assignRolesByCodesDTO: AssignRolesByCodesDTO, by?: string) => Promise<boolean>
}

/** 用户模块控制器接口 */
export interface IUserController {
  /**
   * 创建用户接口
   * @param createUserDTO 创建用户参数
   */
  create: (createUserDTO: CreateUserDTO) => Promise<UserVO>

  /**
   * 删除用户接口
   * @param userIdDTO 用户ID
   */
  delete: (userIdDTO: UserIdDTO) => Promise<typeof DEL_BY_ID_VO>

  /**
   * 分页查询接口
   * @param findAllDTO 查询参数
   */
  findAll: (findAllDTO: FindAllDTO) => Promise<FindAllUserVO>

  /**
   * 查询单个用户详情接口
   * @param userIdDTO 用户ID
   */
  findOne: (userIdDTO: UserIdDTO) => Promise<UserVO>

  /**
   * 更新用户接口
   * @param userIdDTO 用户ID
   * @param updateUserDTO 更新用户参数
   */
  update: (userIdDTO: UserIdDTO, updateUserDTO: UpdateUserDTO) => Promise<typeof UPDATE_VO>

  /**
   * 更新状态接口
   * @param userIdDTO 用户ID
   * @param updateStatusDTO 更新状态参数
   */
  updateStatus: (userIdDTO: UserIdDTO, updateStatusDTO: UpdateStatusDTO) => Promise<typeof UPDATE_STATUS_VO>

  /**
   * 分配角色接口
   * @param assignRolesByIdsDTO 分配角色参数
   */
  assignRoles: (assignRolesByIdsDTO: AssignRolesByIdsDTO) => Promise<typeof UPDATE_VO>
}
