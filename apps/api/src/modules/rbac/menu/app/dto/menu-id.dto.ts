import { ApiSchema } from '@nestjs/swagger'
import { IdDTO } from '@/common/dto'

/** 菜单ID参数校验 */
@ApiSchema({ description: '菜单ID参数校验' })
export class MenuIdDTO extends IdDTO {}
