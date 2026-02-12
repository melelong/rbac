import { ApiSchema } from '@nestjs/swagger'
import { IdsDTO } from '@/common/dto'

/** 角色ID列表参数校验 */
@ApiSchema({ description: '角色ID列表参数校验' })
export class RoleIdsDTO extends IdsDTO {}
