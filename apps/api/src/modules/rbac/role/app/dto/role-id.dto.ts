import { ApiSchema } from '@nestjs/swagger'
import { IdDTO } from '@/common/dto'

/** 角色ID参数校验 */
@ApiSchema({ description: '角色ID参数校验' })
export class RoleIdDTO extends IdDTO {}
