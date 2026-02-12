import { ApiSchema } from '@nestjs/swagger'
import { IdsDTO } from '@/common/dto'

/** 资源ID列表参数校验 */
@ApiSchema({ description: '资源ID列表参数校验' })
export class ResourceIdsDTO extends IdsDTO {}
