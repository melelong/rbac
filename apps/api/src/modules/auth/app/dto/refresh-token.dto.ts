import type { IRefreshTokenDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { REFRESH_TOKEN } from '@/common/constants'
import { InputSpace, Length } from '@/common/deco'

/** 刷新令牌接口参数校验 */
@ApiSchema({ description: '刷新令牌接口参数校验' })
export class RefreshTokenDTO implements IRefreshTokenDTO {
  /**
   * 刷新令牌
   * @example 'xxx'
   */
  @Length(271, 271, REFRESH_TOKEN)
  @InputSpace(REFRESH_TOKEN)
  @IsOptional()
  refreshToken?: string
}
