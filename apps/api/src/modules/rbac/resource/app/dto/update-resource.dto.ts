import { ApiSchema } from '@nestjs/swagger'
import { IUpdateResourceDTO, ResourceTypeEnum } from '@packages/types'
import { IsEnum, IsOptional } from 'class-validator'
import { REMARK } from '@/common/constants'
import { InputSpace, InputTrim, Length } from '@/common/deco'
import { RESOURCE_DOMAIN, RESOURCE_METHOD, RESOURCE_NAME } from '../../domain'

/** 更新资源接口参数校验 */
@ApiSchema({ description: '更新资源接口参数校验' })
export class UpdateResourceDTO implements IUpdateResourceDTO {
  /**
   * 资源名
   * @example '资源名'
   */
  @Length(2, 64, RESOURCE_NAME)
  @InputTrim(RESOURCE_NAME)
  @IsOptional()
  name?: string

  /**
   * 资源类型(接口:10 静态资源:20 WebSocket连接点:30 定时任务:40 数据权限:50)
   * @example 10
   */
  @IsEnum(ResourceTypeEnum, { message: '请输入正确的资源类型枚举' })
  @IsOptional()
  resourceType?: ResourceTypeEnum

  /**
   * 资源领域
   * @example 'USER'
   */
  @Length(2, 64, RESOURCE_DOMAIN)
  @InputSpace(RESOURCE_DOMAIN)
  @IsOptional()
  domain?: string

  /**
   * 资源方法
   * @example 'CREATE'
   */
  @Length(2, 64, RESOURCE_METHOD)
  @InputSpace(RESOURCE_METHOD)
  @IsOptional()
  method?: string

  /**
   * 备注
   * @example 'xxx'
   */
  @Length(1, 500, REMARK)
  @InputTrim(REMARK)
  @IsOptional()
  remark?: string
}
