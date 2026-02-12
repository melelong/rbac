import { ApiSchema } from '@nestjs/swagger'
import { IdsDTO } from '@/common/dto'

/** 用户ID列表参数校验 */
@ApiSchema({ description: '用户ID列表参数校验' })
export class UserIdsDTO extends IdsDTO {}
