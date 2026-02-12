import type { IIdDTO } from '@packages/types'
import { InputSpace, Length, NotEmpty } from '@/common/deco'

export class IdDTO implements IIdDTO {
  /**
   * 业务ID
   * @example 'xxx'
   */
  @Length(36, 36, '业务ID')
  @InputSpace('业务ID')
  @NotEmpty('业务ID')
  id: string
}
