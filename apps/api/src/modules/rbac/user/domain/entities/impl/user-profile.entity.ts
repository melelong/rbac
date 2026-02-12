import type { Relation } from 'typeorm'
import type { IUserProfileEntity } from '../IUserProfileEntity'
import { SexEnum } from '@packages/types'
import { Column, Entity, Index, OneToOne } from 'typeorm'
import { AVATAR, BIRTHDAY, EMAIL, EMAIL_MAX, NICK_NAME, NICK_NAME_MAX, PHONE, PHONE_MAX, SEX, URL_MAX } from '@/common/constants'
import { CommonEntity } from '@/common/entities'
import { USER_PROFILE_TABLE } from '../../constants'
import { UserEntity } from './user.entity'

/** 用户档案表实体实现 */
@Entity({ name: USER_PROFILE_TABLE, comment: '用户档案表' })
@Index(['email'])
@Index(['phone'])
export class UserProfileEntity extends CommonEntity implements IUserProfileEntity {
  @Column({
    comment: NICK_NAME,
    name: 'nick_name',
    type: 'varchar',
    length: NICK_NAME_MAX,
    charset: 'utf8mb4',
    default: '',
  })
  nickName: string

  @Column({
    comment: SEX,
    name: 'sex',
    type: 'tinyint',
    unsigned: true,
    default: SexEnum.UNKNOWN,
  })
  sex: SexEnum

  @Column({
    comment: BIRTHDAY,
    name: 'birthday',
    type: 'date',
    nullable: true,
    default: null,
  })
  birthday: Date | null

  @Column({
    comment: EMAIL,
    name: 'email',
    type: 'varchar',
    length: EMAIL_MAX,
    nullable: true,
    default: null,
  })
  email: string | null

  @Column({
    comment: PHONE,
    name: 'phone',
    type: 'varchar',
    length: PHONE_MAX,
    nullable: true,
    default: null,
  })
  phone: string | null

  @Column({
    comment: AVATAR,
    name: 'avatar',
    type: 'varchar',
    length: URL_MAX,
    charset: 'utf8mb4',
    default: `https://cn.cravatar.com/avatar/`,
  })
  avatar: string

  @OneToOne(() => UserEntity, (user) => user.profile)
  user: Relation<UserEntity>
}
