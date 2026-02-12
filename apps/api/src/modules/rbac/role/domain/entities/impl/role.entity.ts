import type { IRoleEntity } from '../IRoleEntity'
import { DataScopeEnum } from '@packages/types'
import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { UUID_V4_LENGTH } from '@/common/constants'
import { CommonEntity } from '@/common/entities'
import { MenuEntity } from '@/modules/rbac/menu/domain'
import { ResourceEntity } from '@/modules/rbac/resource/domain'
import { UserEntity } from '@/modules/rbac/user/domain'
import {
  ROLE_CODE,
  ROLE_CODE_MAX,
  ROLE_DATA_SCOPE,
  ROLE_MENU_TABLE,
  ROLE_NAME,
  ROLE_NAME_MAX,
  ROLE_PARENT_ID,
  ROLE_RESOURCE_TABLE,
  ROLE_TABLE,
} from '../../../domain'
import { RoleTreeEntity } from './role-tree.entity'

/** 角色表实体实现 */
@Entity({ name: ROLE_TABLE, comment: '角色表' })
@Index(['name'])
@Index(['parentId'])
export class RoleEntity extends CommonEntity implements IRoleEntity {
  @Column({
    comment: ROLE_NAME,
    name: 'name',
    type: 'varchar',
    length: ROLE_NAME_MAX,
    charset: 'utf8mb4',
  })
  name: string

  @Column({
    comment: ROLE_PARENT_ID,
    name: 'parent_id',
    type: 'varchar',
    length: UUID_V4_LENGTH,
    charset: 'ascii',
    nullable: true,
  })
  parentId: string | null

  @Column({
    comment: ROLE_CODE,
    name: 'role_code',
    type: 'varchar',
    length: ROLE_CODE_MAX,
  })
  roleCode: string

  @Column({
    comment: ROLE_DATA_SCOPE,
    name: 'data_scope',
    type: 'tinyint',
    unsigned: true,
    default: DataScopeEnum.ALL,
  })
  dataScope: DataScopeEnum

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[]

  @ManyToMany(() => ResourceEntity, (resource) => resource.roles, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    createForeignKeyConstraints: false,
    eager: true,
  })
  @JoinTable({
    name: ROLE_RESOURCE_TABLE,
    joinColumns: [{ name: 'role_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'resource_id', referencedColumnName: 'id' }],
  })
  resources: ResourceEntity[]

  @ManyToMany(() => MenuEntity, (menu) => menu.roles, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    createForeignKeyConstraints: false,
    eager: true,
  })
  @JoinTable({
    name: ROLE_MENU_TABLE,
    joinColumns: [{ name: 'role_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'menu_id', referencedColumnName: 'id' }],
  })
  menus: MenuEntity[]

  @OneToMany(() => RoleTreeEntity, (node) => node.descendantRole)
  ancestorNodes: RoleTreeEntity[]

  @OneToMany(() => RoleTreeEntity, (node) => node.ancestorRole)
  descendantNodes: RoleTreeEntity[]
}
