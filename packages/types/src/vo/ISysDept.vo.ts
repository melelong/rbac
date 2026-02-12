import type { ICommonVO, IFindAllVO, IIdsVO } from './ICommon.vo'
import type { IRoleDetailsVO } from './IRole.vo'

/** 部门详情 */
export interface ISysDeptDetailsVO extends ICommonVO {
  /** 父部门ID */
  parentId: string | null
  /** 部门名 */
  name: string
  /** 部门编码 */
  deptCode: string
  /** 部门负责人ID */
  leaderId: string
  /** 部门邮箱 */
  email: string | null
  /** 部门电话 */
  phone: string | null
  /** 角色列表 */
  roles: IRoleDetailsVO[]
}

/** 分页查询部门详情列表 */
export interface IFindAllSysDeptVO extends IFindAllVO<ISysDeptDetailsVO> {}

/** 部门ID列表 */
export interface ISysDeptIdsVO extends IIdsVO {}
