import { ApiSchema } from '@nestjs/swagger'
import { IdsDTO } from '@/common/dto'

/** 认证ID列表参数校验 */
@ApiSchema({ description: '认证ID列表参数校验' })
export class AuthIdsDTO extends IdsDTO {}
