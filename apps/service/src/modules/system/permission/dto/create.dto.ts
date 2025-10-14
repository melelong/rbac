import { ActionTypeEnum, ICreatePermissionDTO } from '@packages/types'
import { IsEnum, IsOptional } from 'class-validator'
import { REMARK, REMARK_MAX, REMARK_MIN } from '@/common/constants'
import { ApiModel, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import {
  PERMISSION_DOMAIN,
  PERMISSION_DOMAIN_MAX,
  PERMISSION_DOMAIN_MIN,
  PERMISSION_NAME,
  PERMISSION_NAME_MAX,
  PERMISSION_NAME_MIN,
} from '../permission.constant'

@ApiModel(
  {
    name: { type: String, description: PERMISSION_NAME, minLength: PERMISSION_NAME_MIN, maxLength: PERMISSION_NAME_MAX, example: '用户模块管理权限' },
    domain: {
      type: String,
      description: PERMISSION_DOMAIN,
      minLength: PERMISSION_DOMAIN_MIN,
      maxLength: PERMISSION_DOMAIN_MAX,
      example: 'USER',
    },
    actionType: {
      enum: ActionTypeEnum,
      description: '操作类型(管理:10 读取:20 创建:30 更新:40 删除:50 导出:60 导入:70)',
      example: ActionTypeEnum.MANAGE,
    },
    remark: { type: String, description: REMARK, minLength: REMARK_MIN, maxLength: REMARK_MAX, example: 'xxx', required: false },
  },
  { description: '创建权限接口参数校验' },
)
export class CreatePermissionDTO implements ICreatePermissionDTO {
  @InputStringLength(PERMISSION_NAME_MIN, PERMISSION_NAME_MAX, PERMISSION_NAME)
  @InputSpace(PERMISSION_NAME)
  @NotEmpty(PERMISSION_NAME)
  name: string

  @InputStringLength(PERMISSION_DOMAIN_MIN, PERMISSION_DOMAIN_MAX, PERMISSION_DOMAIN)
  @InputSpace(PERMISSION_DOMAIN)
  @NotEmpty(PERMISSION_DOMAIN)
  domain: string

  @IsEnum(ActionTypeEnum, {
    message: '请输入正确的操作类型格式',
  })
  actionType: ActionTypeEnum

  @InputStringLength(REMARK_MIN, REMARK_MAX, REMARK)
  @InputSpace(REMARK)
  @IsOptional()
  remark?: string
}
