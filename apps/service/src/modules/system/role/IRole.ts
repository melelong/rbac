import type { AssignPermissionsByCodesDTO, AssignPermissionsByIdsDTO, CreateRoleDTO, RoleCodeDTO, RoleIdDTO, RoleNameDTO } from './dto'
import type { RoleEntity } from './entities/role.entity'
import type { RoleTreeEntity } from './entities/roleTree.entity'
import type { FindAllRoleVO, RoleVO } from './vo'
import type { DEL_BY_ID_VO, UPDATE_STATUS_VO, UPDATE_VO } from '@/common/constants'
import type { FindAllDTO, UpdateStatusDTO } from '@/common/dto'
import type { ICommonEntity } from '@/common/entities/ICommonEntity'
import type { DeptEntity } from '@/modules/system/dept/entities/dept.entity'
import type { PermissionEntity } from '@/modules/system/permission/entities/permission.entity'
import type { UserEntity } from '@/modules/system/user/entities/user.entity'

/** 角色表实体接口 */
export interface IRoleEntity extends ICommonEntity {
  /** 父角色ID */
  parentId: string | null
  /** 角色名 */
  name: string
  /** 角色编码 */
  roleCode: string
  /** 角色N-N用户 */
  users: UserEntity[]
  /** 角色N-N权限 */
  permissions: PermissionEntity[]
  /** 角色N-N部门 */
  depts: DeptEntity[]
  /** 角色N-1角色树(所有祖先,depth>0) */
  ancestorNodes: RoleTreeEntity[]
  /** 角色N-1角色树(所有后代,depth>0) */
  descendantNodes: RoleTreeEntity[]
}

/** 角色树表实体接口 */
export interface IRoleTreeEntity {
  /** 祖先角色ID */
  ancestorId: string
  /** 后代角色ID */
  descendantId: string
  /** 路径长度(0 表示自己) */
  depth: number
  /** 祖先角色 */
  ancestorRole: RoleEntity
  /** 后代角色 */
  descendantRole: RoleEntity
}

/** 角色模块服务接口 */
export interface IRoleService {
  /**
   * 创建角色
   * @param createRoleDTO 创建参数
   * @param by 操作者，默认system
   */
  create: (createRoleDTO: CreateRoleDTO, by?: string) => Promise<RoleVO>

  /**
   * 根据角色ID删除角色
   * @param roleIdDTO 角色ID
   * @param by 操作者，默认system
   */
  delById: (roleIdDTO: RoleIdDTO, by?: string) => Promise<boolean>

  /**
   * 分页查询所有角色
   * @param findAllDTO 查询参数
   * @param isVO 是否返回VO格式(默认:true)
   */
  findAll: ((findAllDTO: FindAllDTO, isVO: true) => Promise<FindAllRoleVO>) &
    ((findAllDTO: FindAllDTO, isVO: false) => Promise<[RoleEntity[], number]>) &
    ((findAllDTO: FindAllDTO) => Promise<FindAllRoleVO>)

  /**
   * 根据角色ID查询单个角色
   * @param roleIdDTO 角色ID
   * @param isVO 是否返回VO格式(默认:true)
   */
  findOneById: ((roleIdDTO: RoleIdDTO, isVO: true) => Promise<RoleVO>) &
    ((roleIdDTO: RoleIdDTO, isVO: false) => Promise<RoleEntity>) &
    ((roleIdDTO: RoleIdDTO) => Promise<RoleVO>)

  /**
   * 根据角色名查询单个角色
   * @param roleNameDTO 角色名
   * @param isVO 是否返回VO格式(默认:true)
   */
  findOneByName: ((roleNameDTO: RoleNameDTO, isVO: true) => Promise<RoleVO>) &
    ((roleNameDTO: RoleNameDTO, isVO: false) => Promise<RoleEntity>) &
    ((roleNameDTO: RoleNameDTO) => Promise<RoleVO>)

  /**
   * 根据角色编码查询单个角色
   * @param roleCodeDTO 角色编码
   * @param isVO 是否返回VO格式(默认:true)
   */
  findOneByCode: ((roleCodeDTO: RoleCodeDTO, isVO: true) => Promise<RoleVO>) &
    ((roleCodeDTO: RoleCodeDTO, isVO: false) => Promise<RoleEntity>) &
    ((roleCodeDTO: RoleCodeDTO) => Promise<RoleVO>)

  /**
   * 更新状态
   * @param roleIdDTO 角色ID
   * @param updateStatusDTO 更新状态参数
   * @param by 操作者，默认system
   */
  updateStatusById: (roleIdDTO: RoleIdDTO, updateStatusDTO: UpdateStatusDTO, by?: string) => Promise<boolean>

  /**
   * 根据权限ID分配权限
   * @param assignPermissionsByIdsDTO 分配权限参数
   * @param by 操作者，默认system
   */
  assignPermissionsByIds: (assignPermissionsByIdsDTO: AssignPermissionsByIdsDTO, by?: string) => Promise<boolean>

  /**
   * 根据权限编码分配权限
   * @param assignPermissionsByCodesDTO 分配权限参数
   * @param by 操作者，默认system
   */
  assignPermissionsByCodes: (assignPermissionsByCodesDTO: AssignPermissionsByCodesDTO, by?: string) => Promise<boolean>
}

/** 角色模块控制器接口 */
export interface IRoleController {
  /**
   * 创建角色接口
   * @param createRoleDTO 创建参数
   */
  create: (createRoleDTO: CreateRoleDTO) => Promise<RoleVO>

  /**
   * 删除用户接口
   * @param roleIdDTO 角色ID
   */
  delete: (roleIdDTO: RoleIdDTO) => Promise<typeof DEL_BY_ID_VO>

  /**
   * 分页查询接口
   * @param findAllDTO 查询参数
   */
  findAll: (findAllDTO: FindAllDTO) => Promise<FindAllRoleVO>

  /**
   * 查询单个角色详情接口
   * @param roleIdDTO 角色ID
   */
  findOne: (roleIdDTO: RoleIdDTO) => Promise<RoleVO>

  /**
   * 更新状态接口
   * @param roleIdDTO 角色ID
   * @param updateStatusDTO 更新状态参数
   */
  updateStatus: (roleIdDTO: RoleIdDTO, updateStatusDTO: UpdateStatusDTO) => Promise<typeof UPDATE_STATUS_VO>

  /**
   * 分配权限接口
   * @param assignPermissionsByIdsDTO 分配权限参数
   */
  assignPermissions: (assignPermissionsByIdsDTO: AssignPermissionsByIdsDTO) => Promise<typeof UPDATE_VO>
}
