import { ApiSchema } from '@nestjs/swagger'
import { ICreateResourceDTO, ResourceTypeEnum } from '@packages/types'
import { IsEnum, IsOptional } from 'class-validator'
import { REMARK } from '@/common/constants'
import { InputCode, InputSpace, InputTrim, Length, NotEmpty } from '@/common/deco'
import { RESOURCE_DOMAIN, RESOURCE_METHOD, RESOURCE_NAME } from '../../domain'

/** 创建资源接口参数校验 */
@ApiSchema({ description: '资源名参数校验' })
export class CreateResourceDTO implements ICreateResourceDTO {
  /**
   * 资源名
   * @example '用户创建接口'
   */
  @Length(2, 64, RESOURCE_NAME)
  @InputTrim(RESOURCE_NAME)
  @NotEmpty(RESOURCE_NAME)
  name: string

  /**
   * 资源类型(接口:10 静态资源:20 WebSocket连接点:30 定时任务:40 数据权限:50)
   * @example 10
   */
  @IsEnum(ResourceTypeEnum, { message: '请输入正确的资源类型枚举' })
  resourceType: ResourceTypeEnum

  /**
   * 资源领域
   * @example 'USER'
   */
  @InputCode(RESOURCE_DOMAIN)
  @Length(2, 64, RESOURCE_DOMAIN)
  @InputSpace(RESOURCE_DOMAIN)
  @NotEmpty(RESOURCE_DOMAIN)
  domain: string

  /**
   * 资源方法
   * @example 'CREATE'
   */
  @InputCode(RESOURCE_METHOD)
  @Length(2, 64, RESOURCE_METHOD)
  @InputSpace(RESOURCE_METHOD)
  @NotEmpty(RESOURCE_METHOD)
  method: string

  /**
   * 备注
   * @example 'xxx'
   */
  @Length(1, 500, REMARK)
  @InputTrim(REMARK)
  @IsOptional()
  remark?: string
}
