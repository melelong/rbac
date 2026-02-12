import type { ICommonEntity } from './ICommonEntity'
import { AggregateRoot } from '@nestjs/cqrs'
import { SortEnum, StatusEnum } from '@packages/types'
import { Expose } from 'class-transformer'
import {
  BeforeInsert,
  BeforeSoftRemove,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { REMARK, REMARK_MAX, SYSTEM_DEFAULT_BY, SYSTEM_DEFAULT_REMARK } from '@/common/constants'
import { uuid_v4 } from '@/common/utils'

/** 实体公共字段 */
export abstract class CommonEntity extends AggregateRoot implements ICommonEntity {
  @PrimaryGeneratedColumn('increment', {
    comment: '表索引',
    name: '_id',
    type: 'int',
  })
  _id: number

  @Column({
    comment: '业务ID',
    name: 'id',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
    unique: true,
  })
  id: string

  @Column({
    comment: '创建者',
    name: 'created_by',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
    default: 'sys',
  })
  createdBy: string

  @Column({
    comment: '更新者',
    name: 'updated_by',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
    default: 'sys',
  })
  updatedBy: string

  @Column({
    comment: '删除者',
    name: 'deleted_by',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
    nullable: true,
    default: null,
  })
  deletedBy: string | null

  @CreateDateColumn({
    comment: '创建时间',
    name: 'created_at',
    type: 'datetime',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date

  @UpdateDateColumn({
    comment: '更新时间',
    name: 'updated_at',
    type: 'datetime',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date

  @DeleteDateColumn({
    comment: '删除时间',
    name: 'deleted_at',
    type: 'datetime',
    nullable: true,
    precision: 6,
    default: null,
  })
  deletedAt: Date | null

  @Column({
    comment: REMARK,
    name: 'remark',
    type: 'varchar',
    length: REMARK_MAX,
    nullable: true,
    default: null,
  })
  remark: string | null

  @Column({
    comment: '状态',
    name: 'status',
    type: 'tinyint',
    unsigned: true,
    default: StatusEnum.ENABLE,
  })
  status: StatusEnum

  @Column({
    comment: '排序优先级',
    name: 'sort_order',
    type: 'tinyint',
    unsigned: true,
    default: SortEnum.LOW_PRIORITY,
  })
  sort: SortEnum

  @Expose()
  @BeforeInsert()
  init() {
    const now = new Date()
    const by = SYSTEM_DEFAULT_BY
    const remark = SYSTEM_DEFAULT_REMARK
    if (!this.id) this.id = uuid_v4()
    if (!this.remark) this.remark = `${remark}_create`
    if (!this.createdBy) this.createdBy = by
    if (!this.createdAt) this.createdAt = now
    if (!this.updatedBy) this.updatedBy = by
    if (!this.updatedAt) this.updatedAt = now
  }

  @Expose()
  @BeforeUpdate()
  updateInit() {
    const by = SYSTEM_DEFAULT_BY
    const remark = SYSTEM_DEFAULT_REMARK
    if (!this.remark) this.remark = `${remark}_update`
    if (!this.updatedBy) this.updatedBy = by
    if (!this.updatedAt) this.updatedAt = new Date()
  }

  @Expose()
  @BeforeSoftRemove()
  softRemoveInit() {
    const by = SYSTEM_DEFAULT_BY
    const remark = SYSTEM_DEFAULT_REMARK
    if (!this.remark) this.remark = `${remark}_del`
    if (!this.deletedBy) this.deletedBy = by
    if (!this.deletedAt) this.deletedAt = new Date()
  }
}
