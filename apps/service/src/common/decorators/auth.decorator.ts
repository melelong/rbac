import { SetMetadata } from '@nestjs/common'

/** 忽略权限验证KEY */
export const IS_PUBLIC_KEY = Symbol('IS_PUBLIC_KEY')
/** 忽略权限验证 */
export function IsPublic() {
  return SetMetadata(IS_PUBLIC_KEY, true)
}
