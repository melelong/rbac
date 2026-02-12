import type { ILogoutDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { RefreshTokenDTO } from './refresh-token.dto'

/** 退出登录接口参数校验 */
@ApiSchema({ description: '退出登录接口参数校验' })
export class LogoutDTO extends RefreshTokenDTO implements ILogoutDTO {}
