import { ApiSchema } from '@nestjs/swagger'
import { IdDTO } from '@/common/dto'

/** 认证ID参数校验 */
@ApiSchema({ description: '认证ID参数校验' })
export class AuthIdDTO extends IdDTO {}
