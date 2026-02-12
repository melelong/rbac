import { ApiSchema } from '@nestjs/swagger'
import { IdDTO } from '@/common/dto'

/** 资源ID参数校验 */
@ApiSchema({ description: '资源ID参数校验' })
export class ResourceIdDTO extends IdDTO {}
