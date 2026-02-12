import { ApiSchema } from '@nestjs/swagger'
import { IUpdateUserDTO, SexEnum } from '@packages/types'
import { IsDate, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator'
import { AVATAR, EMAIL, NICK_NAME, REMARK } from '@/common/constants'
import { InputEmail, InputSpace, InputTrim, Length } from '@/common/deco'
import { USER_NAME } from '../../domain'

/** 更新用户接口参数校验 */
@ApiSchema({ description: '更新用户接口参数校验' })
export class UpdateUserDTO implements IUpdateUserDTO {
  /**
   * 用户名
   * @example 'Admin'
   */
  @Length(2, 64, USER_NAME)
  @InputTrim(USER_NAME)
  @IsOptional()
  name?: string

  /**
   * 昵称
   * @example '张三'
   */
  @Length(2, 64, NICK_NAME)
  @InputTrim(NICK_NAME)
  @IsOptional()
  nickName?: string

  /**
   * 性别(未知:10 男:20 女:30)
   * @example 10
   */
  @IsEnum(SexEnum, { message: '请输入正确的性别枚举' })
  @IsOptional()
  sex?: SexEnum

  /**
   * 出生日期
   * @example '2000-01-01'
   */
  @IsDate({ message: '请输入正确的日期格式' })
  @IsOptional()
  birthday?: Date

  /**
   * 邮箱
   * @example 'zhangsan@example.com'
   */
  @Length(2, 191, EMAIL)
  @InputEmail()
  @InputSpace(EMAIL)
  @IsOptional()
  email?: string

  /**
   * 手机号
   * @example '13800000000'
   */
  @IsPhoneNumber('CN', { message: '请输入正确的手机号格式' })
  @IsOptional()
  phone?: string

  /**
   * 头像地址
   * @example 'https://cn.cravatar.com/avatar'
   */
  @Length(1, 2048, AVATAR)
  @InputSpace(AVATAR)
  @IsOptional()
  avatar?: string

  /**
   * 备注
   * @example 'xxx'
   */
  @Length(1, 500, REMARK)
  @InputTrim(REMARK)
  @IsOptional()
  remark?: string
}
