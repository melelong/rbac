import { ApiSchema } from '@nestjs/swagger'
import { IUpdateStatusDTO, StatusEnum } from '@packages/types'
import { IsEnum, IsOptional } from 'class-validator'

/** 更新状态接口参数校验 */
@ApiSchema({ description: '更新状态接口参数校验' })
export class UpdateStatusDTO implements IUpdateStatusDTO {
  /**
   * 状态(未知:10 启用:20 禁用:30)
   * @example 20
   */
  @IsEnum(StatusEnum, {
    message: '请输入正确的状态格式',
  })
  @IsOptional()
  status: StatusEnum = 20
}
