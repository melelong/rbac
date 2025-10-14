import type { IIdDTO } from '@packages/types'
import { IUpdateStatusDTO, StatusEnum } from '@packages/types'
import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator'
import { ApiModel } from '@/common/decorators'
import { InputSpace, InputStringLength, NotEmpty } from '@/common/decorators/validator.decorator'
import { UUID_V4_LENGTH } from '../constants'

@ApiModel({
  page: { type: Number, description: '第几页', required: false },
  limit: { type: Number, description: '一页几条数据', required: false },
})
export class FindAllDTO {
  @Min(1, { message: 'page至少为1' })
  @IsNumber({}, { message: '请输入正确的数字格式' })
  @Type(() => Number)
  @IsOptional()
  page?: number

  @Max(100, { message: 'limit最多为100' })
  @Min(1, { message: 'limit至少为1' })
  @IsNumber({}, { message: '请输入正确的数字格式' })
  @Type(() => Number)
  @IsOptional()
  limit?: number
}

export class IdDTO implements IIdDTO {
  @InputStringLength(UUID_V4_LENGTH, UUID_V4_LENGTH, 'id')
  @InputSpace('id')
  @NotEmpty('id')
  id: string
}

@ApiModel(
  {
    status: { enum: StatusEnum, description: '状态(未知:10 启用:20 禁用:30)', example: StatusEnum.ENABLE },
  },
  { description: '更新状态接口参数校验' },
)
export class UpdateStatusDTO implements IUpdateStatusDTO {
  @IsEnum(StatusEnum, {
    message: '请输入正确的状态格式',
  })
  @IsOptional()
  status: StatusEnum
}
