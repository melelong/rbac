import type { IIdsDTO } from '@packages/types'
import { ArrayUnique } from 'class-validator'
import { InputArray, InputSpace, Length, NotEmpty } from '@/common/deco'

export class IdsDTO implements IIdsDTO {
  /**
   * 业务ID列表
   * @example ['xxx', 'xxx']
   */
  @ArrayUnique({ message: '业务ID重复' })
  @Length(36, 36, '业务ID', true)
  @InputSpace('业务ID', true)
  @NotEmpty('业务ID', true)
  @InputArray('业务ID')
  ids: string[]
}
