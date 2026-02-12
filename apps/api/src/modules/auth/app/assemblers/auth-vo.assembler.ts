import type { ISvgCaptchaVO, ITokenVO } from '@packages/types'
import type { ExcludeKeys } from '@/common/utils'
import type { IFindAllVOOptions } from '@/common/vo'
import type { UserEntity } from '@/modules/rbac/user/domain'
import { AuthEntity } from '../../domain'
import { AuthDetailsVO, AuthIdsVO, FindAllAuthVO, MeInfoVO, SvgCaptchaVO, TokenVO } from '../vo'

/** 认证转换器 */
export class AuthVOAssembler {
  /** 将实体转换为详情VO */
  static toDetailsVO(auth: AuthEntity) {
    return new AuthDetailsVO(auth)
  }

  /** 将实体转换为分页VO */
  static toFindAllVO(options: ExcludeKeys<IFindAllVOOptions<AuthEntity>, 'DataConstructor'>) {
    const { data, limit, page, total } = options
    return new FindAllAuthVO({ DataConstructor: AuthDetailsVO, data, limit, page, total })
  }

  /** 将实体列表转换为ID列表VO */
  static toIdsVO(auths: AuthEntity[]) {
    return new AuthIdsVO(auths)
  }

  /** 将svg验证码转换为VO */
  static toSvgCaptchaVO(svgCaptcha: ISvgCaptchaVO) {
    return new SvgCaptchaVO(svgCaptcha)
  }

  /** 将令牌详情转换为VO */
  static toTokenVO(token: ITokenVO) {
    return new TokenVO(token)
  }

  static toMeInfo(user: UserEntity) {
    return new MeInfoVO(user)
  }
}
