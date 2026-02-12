import type { CaptchaNameDTO } from '../dto'
import type { SvgCaptchaVO } from '../vo'
import { Query } from '@nestjs/cqrs'

/** 获取SVG验证码Query */
export class GetSvgCaptchaQuery extends Query<SvgCaptchaVO> {
  constructor(public readonly captchaNameDTO: CaptchaNameDTO) {
    super()
  }
}
