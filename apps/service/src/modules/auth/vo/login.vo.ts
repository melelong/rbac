import type { ILoginVO, IUserInfo } from '@packages/types'
import { ApiModel } from '@/common/decorators'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../auth.constant'

@ApiModel(
  {
    id: { type: String, description: '业务ID', example: 'xxx' },
    name: { type: String, description: '用户名', example: 'xxx' },
    loginIp: { type: String, description: '登录IP', example: 'xxx' },
    loginAt: { type: Date, description: '登录时间', example: 'xxx' },
  },
  { description: '用户信息' },
)
export class UserInfo implements IUserInfo {
  id: string
  name: string
  email: string | null
  loginIp: string | null
  loginAt: Date | null
  constructor(userInfo?: UserInfo) {
    if (userInfo) {
      const { id, name, loginIp, loginAt, email } = userInfo
      this.id = id
      this.name = name
      this.email = email
      this.loginIp = loginIp
      this.loginAt = loginAt
    }
  }
}

@ApiModel(
  {
    accessToken: { type: String, description: ACCESS_TOKEN, example: 'xxx' },
    refreshToken: { type: String, description: REFRESH_TOKEN, example: 'xxx' },
  },
  { description: '登录响应数据' },
)
export class LoginVO implements ILoginVO {
  accessToken: string
  refreshToken: string
  constructor(login?: LoginVO) {
    if (login) {
      const { accessToken, refreshToken } = login
      this.accessToken = accessToken
      this.refreshToken = refreshToken
    }
  }
}
