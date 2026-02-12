import { ApiSchema } from '@nestjs/swagger'
import { IUpdateSortDTO, SortEnum } from '@packages/types'
import { IsEnum, IsOptional } from 'class-validator'

/** 更新排序优先级接口参数校验 */
@ApiSchema({ description: '更新排序优先级接口参数校验' })
export class UpdateSortDTO implements IUpdateSortDTO {
  /**
   * 排序优先级(低优先级:10 中等优先级:20 高优先级:30)
   * @example 10
   */
  @IsEnum(SortEnum, { message: '请输入正确的排序优先级格式' })
  @IsOptional()
  sort: SortEnum = 10
}
