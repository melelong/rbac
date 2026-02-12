import { SetMetadata } from '@nestjs/common'

/** 忽略http格式化KEY */
export const IS_NO_FORMAT_KEY = Symbol('IS_NO_FORMAT_KEY')
/** 忽略http格式化(用于资源接口，避免响应体被格式化) */
export function IsNoFormat() {
  return SetMetadata(IS_NO_FORMAT_KEY, true)
}
