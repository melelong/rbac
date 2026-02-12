import type { ResourceTypeEnum } from '@packages/types'
import { SetMetadata } from '@nestjs/common'
import { ResourceTypeCodeMap } from '@packages/types'
import { camelToConst } from '@/common/utils'

/** 忽略JWT权限验证KEY */
export const IS_PUBLIC_KEY = Symbol('IS_PUBLIC_KEY')
/** 忽略JWT权限验证(用于公共接口) */
export function IsPublic() {
  return SetMetadata(IS_PUBLIC_KEY, true)
}

/** 标记资源类型编码KEY */
export const RESOURCE_TYPE_KEY = Symbol('RESOURCE_TYPE_KEY')
/** 标记资源类型编码(用于接口资源权限验证，类定义时用) */
export function ResourceType(type: ResourceTypeEnum) {
  const _typeCode = ResourceTypeCodeMap[type]
  return SetMetadata(RESOURCE_TYPE_KEY, _typeCode)
}

/** 标记资源域编码KEY */
export const RESOURCE_DOMAIN_KEY = Symbol('RESOURCE_DOMAIN_KEY')
/** 标记资源域编码(用于接口资源权限验证，类定义时用) */
export function ResourceDomain(domainCode: string) {
  const regExp = /^(?=.*[A-Z])[A-Z\d_]+$/
  if (!regExp.test(domainCode)) {
    throw new Error(`${domainCode} 不符合资源域编码规则, 资源域编码只能包含大写字母、数字、_`)
  }
  const _domainCode = camelToConst(domainCode)
  return SetMetadata(RESOURCE_DOMAIN_KEY, _domainCode)
}

/** 标记资源方法编码KEY */
export const RESOURCE_METHOD_KEY = Symbol('RESOURCE_METHOD_KEY')
/** 标记资源方法编码(用于接口资源权限验证，类方法定义时用) */
export function ResourceMethod(methodCode: string) {
  const regExp = /^[a-z\d]+$/i
  if (!regExp.test(methodCode)) {
    throw new Error(`${methodCode} 不符合资源方法编码规则, 资源方法编码只能包含字母、数字`)
  }
  const _methodCode = camelToConst(methodCode)
  return SetMetadata(RESOURCE_METHOD_KEY, _methodCode)
}
