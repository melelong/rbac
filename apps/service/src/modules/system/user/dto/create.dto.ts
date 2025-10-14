import type { ICreateUserDTO } from '@packages/types'
import { IsOptional } from 'class-validator'
import { REMARK, REMARK_MAX, REMARK_MIN } from '@/common/constants'
import { ApiModel, InputPwd, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { PWD, PWD_MAX, PWD_MIN, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '../user.constant'

@ApiModel(
  {
    name: { type: String, description: USER_NAME, minLength: USER_NAME_MIN, maxLength: USER_NAME_MAX, example: 'admin' },
    pwd: { type: String, description: PWD, minLength: PWD_MIN, maxLength: PWD_MAX, example: 'Aa123456' },
    remark: { type: String, description: REMARK, minLength: REMARK_MIN, maxLength: REMARK_MAX, example: 'xxx', required: false },
  },
  { description: '创建用户接口参数校验' },
)
export class CreateUserDTO implements ICreateUserDTO {
  @InputStringLength(USER_NAME_MIN, USER_NAME_MAX, USER_NAME)
  @InputSpace(USER_NAME)
  @NotEmpty(USER_NAME)
  name: string

  @InputStringLength(PWD_MIN, PWD_MAX, PWD)
  @InputPwd()
  @InputSpace(PWD)
  @NotEmpty(PWD)
  pwd: string

  @InputStringLength(REMARK_MIN, REMARK_MAX, REMARK)
  @InputSpace(REMARK)
  @IsOptional()
  remark?: string
}
