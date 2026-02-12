import type { ISvgCaptchaVO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'

/** svg验证码 */
@ApiSchema({ description: 'svg验证码' })
export class SvgCaptchaVO implements ISvgCaptchaVO {
  /**
   * svg验证码凭证
   * @example 'svg验证码凭证'
   */
  token: string
  /**
   * svg验证码Base64
   * @example 'data:image/svg+xml;base64,XXXX'
   */
  svg: string
  constructor(svgCaptcha?: ISvgCaptchaVO) {
    if (svgCaptcha) {
      const { svg, token } = svgCaptcha
      this.svg = svg
      this.token = token
    }
  }
}
