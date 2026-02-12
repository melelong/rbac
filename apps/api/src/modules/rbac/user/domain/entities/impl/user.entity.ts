import type { Relation } from 'typeorm'
import type { IUserEntity } from '../IUserEntity'
import { Expose } from 'class-transformer'
import { BeforeInsert, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, OneToOne } from 'typeorm'
import { PWD, PWD_MAX } from '@/common/constants'
import { CommonEntity } from '@/common/entities'
import { uuid_v4 } from '@/common/utils'
import { RoleEntity } from '@/modules/rbac/role/domain'
import { USER_NAME, USER_NAME_MAX, USER_ROLE_TABLE, USER_TABLE } from '../../../domain'
import { UserProfileEntity } from './user-profile.entity'

/** 用户表实体实现 */
@Entity({ name: USER_TABLE, comment: '用户表' })
@Index(['name'])
export class UserEntity extends CommonEntity implements IUserEntity {
  @Column({
    comment: USER_NAME,
    name: 'name',
    type: 'varchar',
    length: USER_NAME_MAX,
    charset: 'utf8mb4',
  })
  name: string

  @Column({
    comment: PWD,
    name: 'pwd',
    type: 'varchar',
    length: PWD_MAX,
  })
  pwd: string

  @Column({
    comment: '最后登录的IP',
    name: 'login_ip',
    type: 'varchar',
    length: 128,
    nullable: true,
    default: null,
  })
  loginIp: string | null

  @Column({
    comment: '最后登录时间',
    name: 'login_at',
    type: 'datetime',
    precision: 6,
    nullable: true,
    default: null,
  })
  loginAt: Date | null

  @Column({
    comment: '密码最后更新时间',
    name: 'pwd_update_at',
    type: 'datetime',
    precision: 6,
    nullable: true,
    default: null,
  })
  pwdUpdateAt: Date | null

  @Column({
    comment: '密码最后更新者',
    name: 'pwd_update_By',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
    nullable: true,
    default: null,
  })
  pwdUpdateBy: string | null

  @Column({
    comment: '盐值',
    name: 'salt',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
  })
  salt: string

  @OneToOne(() => UserProfileEntity, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    createForeignKeyConstraints: false,
    eager: true,
  })
  @JoinColumn({
    name: 'profile_id',
    referencedColumnName: 'id',
  })
  profile: Relation<UserProfileEntity>

  // @OneToMany(() => OAuth2UserBindEntity, (oAuth2Bind) => oAuth2Bind.user)
  // oauth2Binds: OAuth2UserBindEntity[]

  @ManyToMany(() => RoleEntity, (role) => role.users, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    createForeignKeyConstraints: false,
    eager: true,
  })
  @JoinTable({
    name: USER_ROLE_TABLE,
    joinColumns: [{ name: 'user_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'role_id', referencedColumnName: 'id' }],
  })
  roles: RoleEntity[]

  // @ManyToOne(() => PostEntity, (post) => post.users, {
  //   cascade: true,
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  //   createForeignKeyConstraints: false,
  //   eager: true,
  // })
  // @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  // post: PostEntity | null

  @Expose()
  @BeforeInsert()
  generateSalt() {
    if (!this.salt) this.salt = uuid_v4()
  }
}
