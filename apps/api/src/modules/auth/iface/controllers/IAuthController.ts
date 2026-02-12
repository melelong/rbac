import type {
  ICaptchaNameDTO,
  IEmailCaptchaDTO,
  IEmailLoginDTO,
  IEmailRegisterDTO,
  IEmailResetPwdDTO,
  IRefreshTokenDTO,
  ISvgCaptchaVO,
  ISvgLoginDTO,
  ITokenVO,
} from '@packages/types'
import type { Response } from 'express'

/** 认证控制器接口 */
export interface IAuthController {
  svgCaptcha: (captchaNameDTO: ICaptchaNameDTO) => Promise<ISvgCaptchaVO>
  emailCaptcha: (captchaNameDTO: ICaptchaNameDTO, emailCaptchaDTO: IEmailCaptchaDTO) => Promise<never[]>
  svgLogin: (res: Response, _: ISvgLoginDTO) => Promise<ITokenVO>
  emailRegister: (emailRegisterDTO: IEmailRegisterDTO) => Promise<never[]>
  emailLogin: (res: Response, _: IEmailLoginDTO) => Promise<ITokenVO>
  emailResetPwd: (res: Response, _: IEmailResetPwdDTO) => Promise<never[]>
  refreshToken: (res: Response, _: IRefreshTokenDTO) => Promise<ITokenVO>
  loginOut: (res: Response, _: IRefreshTokenDTO) => Promise<never[]>
}
