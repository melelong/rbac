import type { IAuthEntity } from '../IAuthEntity'
import { Column, Entity, Index } from 'typeorm'
import { CommonEntity } from '@/common/entities'
import { AUTH_NAME, AUTH_NAME_MAX, AUTH_TABLE } from '../../../domain'

/** 认证表实体实现 */
@Entity({ name: AUTH_TABLE, comment: '认证表' })
@Index(['name'])
export class AuthEntity extends CommonEntity implements IAuthEntity {
  @Column({
    comment: AUTH_NAME,
    name: 'name',
    type: 'varchar',
    length: AUTH_NAME_MAX,
    charset: 'utf8mb4',
  })
  name: string
}
