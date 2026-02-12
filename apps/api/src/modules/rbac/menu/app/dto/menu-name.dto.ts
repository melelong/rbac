import type { INameDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { InputTrim, Length, NotEmpty } from '@/common/deco'
import { MENU_NAME } from '../../domain'

/** 菜单名参数校验 */
@ApiSchema({ description: '菜单名参数校验' })
export class MenuNameDTO implements INameDTO {
  /**
   * 菜单名
   * @example '菜单名'
   */
  @Length(2, 64, MENU_NAME)
  @InputTrim(MENU_NAME)
  @NotEmpty(MENU_NAME)
  name: string
}
