import type { INameDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { InputTrim, Length, NotEmpty } from '@/common/deco'
import { RESOURCE_NAME } from '../../domain'

/** 资源名参数校验 */
@ApiSchema({ description: '资源名参数校验' })
export class ResourceNameDTO implements INameDTO {
  /**
   * 资源名
   * @example '资源名'
   */
  @Length(2, 64, RESOURCE_NAME)
  @InputTrim(RESOURCE_NAME)
  @NotEmpty(RESOURCE_NAME)
  name: string
}
