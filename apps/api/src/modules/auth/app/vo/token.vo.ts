import type { ITokenVO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'

/** 令牌详情 */
@ApiSchema({ description: '令牌详情' })
export class TokenVO implements ITokenVO {
  /**
   * 访问令牌
   */
  accessToken: string
  /**
   * 刷新令牌
   */
  refreshToken?: string
  constructor(token?: ITokenVO) {
    if (token) {
      const { accessToken, refreshToken } = token
      this.accessToken = accessToken
      this.refreshToken = refreshToken
    }
  }
}
