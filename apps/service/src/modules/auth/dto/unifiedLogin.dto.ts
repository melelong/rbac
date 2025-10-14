import type { IUnifiedLoginDTO } from '@packages/types'
import { LoginTypeEnum } from '@packages/types'
import { IsEnum, ValidateIf } from 'class-validator'
import { CAPTCHA, CAPTCHA_LENGTH, CAPTCHA_TOKEN, CAPTCHA_TOKEN_LENGTH } from '@/common/constants'
import { ApiModel, InputEmail, InputPwd, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { EMAIL, PWD, PWD_MAX, PWD_MIN, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '@/modules/system/user/user.constant'

@ApiModel(
  {
    loginType: { enum: LoginTypeEnum, description: `登录类型(ALL)`, example: LoginTypeEnum.SVG },
    pwd: { type: String, description: `${PWD}(${LoginTypeEnum.SVG},${LoginTypeEnum.EMAIL})`, example: 'Aa123456' },
    captcha: { type: String, description: `${CAPTCHA}(${LoginTypeEnum.SVG},${LoginTypeEnum.EMAIL})`, example: '123456' },
    // SVG登录
    name: { type: String, description: `${USER_NAME}(${LoginTypeEnum.SVG})`, example: 'admin' },
    token: { type: String, description: `${CAPTCHA_TOKEN}(${LoginTypeEnum.SVG})`, example: 'xxx' },
    // 邮箱登录
    email: { type: String, description: `${EMAIL}(${LoginTypeEnum.EMAIL})`, example: 'Aa123456@qq.com' },
  },
  { description: '统一登录接口参数校验' },
)
export class UnifiedLoginDTO implements IUnifiedLoginDTO {
  // 公共部分
  @IsEnum(LoginTypeEnum, { message: '请输入正确的登录类型' })
  loginType: LoginTypeEnum

  @ValidateIf((DTO: UnifiedLoginDTO) => {
    console.warn(DTO)
    return DTO.loginType === LoginTypeEnum.SVG || DTO.loginType === LoginTypeEnum.EMAIL
  })
  @InputStringLength(PWD_MIN, PWD_MAX, PWD)
  @InputPwd()
  @InputSpace(PWD)
  @NotEmpty(PWD)
  pwd: string

  @ValidateIf((DTO: UnifiedLoginDTO) => DTO.loginType === LoginTypeEnum.SVG || DTO.loginType === LoginTypeEnum.EMAIL)
  @InputStringLength(CAPTCHA_LENGTH, CAPTCHA_LENGTH, CAPTCHA)
  @InputSpace(CAPTCHA)
  @NotEmpty(CAPTCHA)
  captcha: string

  // SVG登录
  @ValidateIf((DTO: UnifiedLoginDTO) => DTO.loginType === LoginTypeEnum.SVG)
  @InputStringLength(USER_NAME_MIN, USER_NAME_MAX, USER_NAME)
  @InputSpace(USER_NAME)
  @NotEmpty(USER_NAME)
  name: string

  @ValidateIf((DTO: UnifiedLoginDTO) => DTO.loginType === LoginTypeEnum.SVG)
  @InputStringLength(CAPTCHA_TOKEN_LENGTH, CAPTCHA_TOKEN_LENGTH, CAPTCHA_TOKEN)
  @InputSpace(CAPTCHA_TOKEN)
  @NotEmpty(CAPTCHA_TOKEN)
  token: string

  // 邮箱登录
  @ValidateIf((DTO: UnifiedLoginDTO) => DTO.loginType === LoginTypeEnum.EMAIL)
  @InputEmail()
  @InputSpace(EMAIL)
  @NotEmpty(EMAIL)
  email: string
}
