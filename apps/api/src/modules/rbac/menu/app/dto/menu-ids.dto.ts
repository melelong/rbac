import { ApiSchema } from '@nestjs/swagger'
import { IdsDTO } from '@/common/dto'

/** 菜单ID列表参数校验 */
@ApiSchema({ description: '菜单ID列表参数校验' })
export class MenuIdsDTO extends IdsDTO {}
