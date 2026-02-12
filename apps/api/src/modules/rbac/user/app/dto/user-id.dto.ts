import { ApiSchema } from '@nestjs/swagger'
import { IdDTO } from '@/common/dto'

/** 用户ID参数校验 */
@ApiSchema({ description: '用户ID参数校验' })
export class UserIdDTO extends IdDTO {}
