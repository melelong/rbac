import type { IMenuEntity } from '../IMenuEntity'
import { CheckEnum, MenuTypeEnum } from '@packages/types'
import { Column, Entity, Index, ManyToMany, OneToMany } from 'typeorm'
import { CODE_MAX, URL_MAX, UUID_V4_LENGTH } from '@/common/constants'
import { CommonEntity } from '@/common/entities'
import { RoleEntity } from '@/modules/rbac/role/domain'
import {
  MENU_ACTION,
  MENU_ACTION_MAX,
  MENU_CODE,
  MENU_COMPONENT,
  MENU_DOMAIN,
  MENU_DOMAIN_MAX,
  MENU_ICON,
  MENU_IS_CACHE,
  MENU_IS_REFRESH,
  MENU_IS_VISIBLE,
  MENU_NAME,
  MENU_NAME_MAX,
  MENU_PARENT_ID,
  MENU_PATH,
  MENU_QUERY,
  MENU_TABLE,
  MENU_TYPE,
} from '../../../domain'
import { MenuTreeEntity } from './menu-tree.entity'

/** 菜单表实体实现 */
@Entity({ name: MENU_TABLE, comment: '菜单表' })
@Index(['name'])
@Index(['parentId'])
export class MenuEntity extends CommonEntity implements IMenuEntity {
  @Column({
    comment: MENU_PARENT_ID,
    name: 'parent_id',
    type: 'varchar',
    length: UUID_V4_LENGTH,
    charset: 'ascii',
    nullable: true,
  })
  parentId: string | null

  @Column({
    comment: MENU_NAME,
    name: 'name',
    type: 'varchar',
    length: MENU_NAME_MAX,
    charset: 'utf8mb4',
  })
  name: string

  @Column({
    comment: MENU_CODE,
    name: 'menu_code',
    type: 'varchar',
    length: CODE_MAX,
  })
  menuCode: string

  @Column({
    comment: MENU_DOMAIN,
    name: 'domain',
    type: 'varchar',
    length: MENU_DOMAIN_MAX,
  })
  domain: string

  @Column({
    comment: MENU_ACTION,
    name: 'action',
    type: 'varchar',
    length: MENU_ACTION_MAX,
  })
  action: string

  @Column({
    comment: MENU_PATH,
    name: 'path',
    type: 'varchar',
    length: URL_MAX,
    charset: 'utf8mb4',
    nullable: true,
    default: null,
  })
  path: string | null

  @Column({
    comment: MENU_QUERY,
    name: 'query',
    type: 'varchar',
    length: URL_MAX,
    charset: 'utf8mb4',
    nullable: true,
    default: null,
  })
  query: string | null

  @Column({
    comment: MENU_COMPONENT,
    name: 'component',
    type: 'varchar',
    length: URL_MAX,
    charset: 'utf8mb4',
    nullable: true,
    default: null,
  })
  component: string | null

  @Column({
    comment: MENU_ICON,
    name: 'icon',
    type: 'varchar',
    length: URL_MAX,
    charset: 'utf8mb4',
    nullable: true,
    default: null,
  })
  icon: string | null

  @Column({
    comment: MENU_IS_CACHE,
    name: 'is_cache',
    type: 'tinyint',
    unsigned: true,
    default: CheckEnum.FALSE,
  })
  isCache: CheckEnum

  @Column({
    comment: MENU_IS_VISIBLE,
    name: 'is_visible',
    type: 'tinyint',
    unsigned: true,
    default: CheckEnum.FALSE,
  })
  isVisible: CheckEnum

  @Column({
    comment: MENU_IS_REFRESH,
    name: 'is_refresh',
    type: 'tinyint',
    unsigned: true,
    default: CheckEnum.FALSE,
  })
  isRefresh: CheckEnum

  @Column({
    comment: MENU_TYPE,
    name: 'menu_type',
    type: 'tinyint',
    unsigned: true,
    default: MenuTypeEnum.MENU,
  })
  menuType: MenuTypeEnum

  @ManyToMany(() => RoleEntity, (role) => role.menus)
  roles: RoleEntity[]

  @OneToMany(() => MenuTreeEntity, (node) => node.descendantMenu)
  ancestorNodes: MenuTreeEntity[]

  @OneToMany(() => MenuTreeEntity, (node) => node.ancestorMenu)
  descendantNodes: MenuTreeEntity[]
}
