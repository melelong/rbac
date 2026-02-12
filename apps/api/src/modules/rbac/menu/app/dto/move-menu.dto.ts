import type { IMoveTreeNodeDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { InputSpace, Length } from '@/common/deco'
import { MENU_PARENT_ID } from '../../domain'

/** 移动菜单接口参数校验 */
@ApiSchema({ description: '移动菜单接口参数校验' })
export class MoveMenuDTO implements IMoveTreeNodeDTO {
  /**
   * 父节点ID
   * @example 'xxx'
   */
  @Length(36, 36, MENU_PARENT_ID)
  @InputSpace(MENU_PARENT_ID)
  @IsOptional()
  parentId?: string
}
