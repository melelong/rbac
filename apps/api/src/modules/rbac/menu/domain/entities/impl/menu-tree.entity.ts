import type { IMenuTreeEntity } from '../IMenuTreeEntity'
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { MENU_TREE_TABLE } from '../../../domain'
import { MenuEntity } from './menu.entity'

/** 菜单树表实体实现 */
@Entity({ name: MENU_TREE_TABLE, comment: '菜单树表' })
@Index(['ancestorId', 'descendantId'], { unique: true })
@Index(['ancestorId', 'depth'])
@Index(['descendantId', 'depth'])
export class MenuTreeEntity implements IMenuTreeEntity {
  @PrimaryColumn({
    comment: '祖先菜单ID',
    name: 'ancestor_id',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
  })
  ancestorId: string

  @PrimaryColumn({
    comment: '后代菜单ID',
    name: 'descendant_id',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
  })
  descendantId: string

  @Column({
    comment: '路径长度(0 表示自己)',
    name: 'depth',
    type: 'tinyint',
    unsigned: true,
    default: 0,
  })
  depth: number

  @ManyToOne(() => MenuEntity, (role) => role.ancestorNodes, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    createForeignKeyConstraints: false,
    eager: false,
  })
  @JoinColumn({
    name: 'ancestor_id',
    referencedColumnName: 'id',
  })
  ancestorMenu: MenuEntity

  @ManyToOne(() => MenuEntity, (role) => role.descendantNodes, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    createForeignKeyConstraints: false,
    eager: false,
  })
  @JoinColumn({
    name: 'descendant_id',
    referencedColumnName: 'id',
  })
  descendantMenu: MenuEntity
}
