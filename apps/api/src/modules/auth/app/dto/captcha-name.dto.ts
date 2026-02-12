import type { ICaptchaNameDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { IsIn } from 'class-validator'
import { CAPTCHA_NAME } from '../../domain/services/ICaptchaService'

/** 验证名参数校验 */
@ApiSchema({ description: '验证名参数校验' })
export class CaptchaNameDTO implements ICaptchaNameDTO {
  /**
   * 验证名 ["test", "register", "login", "resetPwd", "updateInfo"]
   * @example 'test'
   */
  @IsIn(CAPTCHA_NAME, { message: '请输入正确的验证名' })
  name: string
}
