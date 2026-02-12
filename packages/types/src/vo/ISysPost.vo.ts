import type { ICommonVO, IFindAllVO, IIdsVO } from './ICommon.vo'
import type { ISysDeptDetailsVO } from './ISysDept.vo'

/** 岗位详情 */
export interface ISysPostDetailsVO extends ICommonVO {
  /** 岗位名 */
  name: string
  /** 岗位编码 */
  postCode: string
  /** 岗位部门 */
  dept: ISysDeptDetailsVO | null
}

/** 分页查询岗位详情列表 */
export interface IFindAllSysPostVO extends IFindAllVO<ISysPostDetailsVO> {}

/** 岗位ID列表 */
export interface ISysPostIdsVO extends IIdsVO {}
