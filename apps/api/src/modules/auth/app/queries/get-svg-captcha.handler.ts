import type { IQueryHandler } from '@nestjs/cqrs'
import type { TCaptchaName } from '../../domain/services/ICaptchaService'
import { QueryHandler } from '@nestjs/cqrs'
import { CaptchaService } from '../../domain'
import { AuthVOAssembler } from '../assemblers'
import { GetSvgCaptchaQuery } from './get-svg-captcha.query'

/** 获取SVG验证码Handler */
@QueryHandler(GetSvgCaptchaQuery)
export class GetSvgCaptchaHandler implements IQueryHandler<GetSvgCaptchaQuery> {
  constructor(private readonly captchaService: CaptchaService) {}
  async execute(query: GetSvgCaptchaQuery) {
    const { captchaNameDTO } = query
    const VO = await this.captchaService.generateSvgCaptcha(captchaNameDTO.name as TCaptchaName)
    return AuthVOAssembler.toSvgCaptchaVO(VO)
  }
}
