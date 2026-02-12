import type { ICreateUserDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { EMAIL, PHONE, PWD, REMARK } from '@/common/constants'
import { InputPwd, InputSpace, InputTrim, Length, NotEmpty } from '@/common/deco'
import { USER_NAME } from '../../domain'

/** 创建用户接口参数校验 */
@ApiSchema({ description: '用户名参数校验' })
export class CreateUserDTO implements ICreateUserDTO {
  /**
   * 用户名
   * @example '用户名'
   */
  @Length(2, 64, USER_NAME)
  @InputTrim(USER_NAME)
  @NotEmpty(USER_NAME)
  name: string

  /**
   * 邮箱
   * @example 'zhangsan@example.com'
   */
  @Length(2, 191, EMAIL)
  @InputSpace(EMAIL)
  @IsOptional()
  email?: string

  /**
   * 电话号码
   * @example '13800000000'
   */
  @Length(2, 11, PHONE)
  @InputSpace(PHONE)
  @IsOptional()
  phone?: string

  /**
   * 密码
   * @example 'Aa123456'
   */
  @InputPwd()
  @Length(8, 64, PWD)
  @InputSpace(PWD)
  @NotEmpty(PWD)
  pwd: string

  /**
   * 备注
   * @example 'xxx'
   */
  @Length(1, 500, REMARK)
  @InputTrim(REMARK)
  @IsOptional()
  remark?: string
}
