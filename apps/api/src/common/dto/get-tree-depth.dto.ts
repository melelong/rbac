import { ApiSchema } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, Min } from 'class-validator'
import { TREE_DEPTH } from '@/common/constants'

/** 查看单个树结构深度参数校验 */
@ApiSchema({ description: '查看单个树结构深度参数校验' })
export class GetTreeDepthDTO {
  /**
   * 树深度,-1是深度无限制
   * @example -1
   */
  @Min(-1, { message: `${TREE_DEPTH}至少为-1` })
  @IsNumber({}, { message: '请输入正确的数字格式' })
  @Type(() => Number)
  @IsOptional()
  depth?: number
}
