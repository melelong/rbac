import { ApiSchema } from '@nestjs/swagger'
import { OrderByTypeEnum, OrderTypeEnum } from '@packages/types'
import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

/** 分页查询接口参数校验 */
@ApiSchema({ description: '分页查询接口参数校验' })
export class FindAllDTO {
  /**
   * 第几页
   * @example 1
   */
  @Min(1, { message: 'page至少为1' })
  @Max(200, { message: 'page最多为200' })
  @IsNumber({}, { message: '请输入正确的数字格式' })
  @Type(() => Number)
  @IsOptional()
  page?: number

  /**
   * 一页几条数据
   * @example 10
   */
  @Max(2000, { message: 'limit最多为2000' })
  @Min(1, { message: 'limit至少为1' })
  @IsNumber({}, { message: '请输入正确的数字格式' })
  @Type(() => Number)
  @IsOptional()
  limit?: number

  /**
   * 搜索关键词
   * @example '张三'
   */
  @IsString({ message: '请输入正确的字符串格式' })
  @IsOptional()
  keyword?: string

  /**
   * 排序字段(创建时间:createdAt 更新时间:updatedAt 名称:name)
   * @example 'createdAt'
   */
  @IsEnum(OrderByTypeEnum, { message: '请输入正确的排序字段' })
  @IsString({ message: '请输入正确的字符串格式' })
  @IsOptional()
  orderBy?: OrderByTypeEnum

  /**
   * 排序方式(升序:asc 降序:desc)
   * @example 'asc'
   */
  @IsEnum(OrderTypeEnum, { message: '请输入正确的排序方式' })
  @IsString({ message: '请输入正确的字符串格式' })
  @IsOptional()
  orderType?: OrderTypeEnum
}
