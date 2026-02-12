import type { IRoleEntity } from './IRoleEntity'

/** 角色树表实体接口 */
export interface IRoleTreeEntity {
  /** 祖先角色ID */
  ancestorId: string
  /** 后代角色ID */
  descendantId: string
  /** 路径长度(0 表示自己，1 表示父子 ，>1 表示子孙) */
  depth: number
  /** 祖先角色 */
  ancestorRole: IRoleEntity
  /** 后代角色 */
  descendantRole: IRoleEntity
}
