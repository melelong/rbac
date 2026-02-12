import type { ApiHeaderOptions, ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger'
import type { CallBackObject } from '@nestjs/swagger/dist/interfaces/callback-object.interface'
import type { SecurityRequirementObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { applyDecorators } from '@nestjs/common'
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiCallbacks,
  ApiCookieAuth,
  ApiHeaders,
  ApiOAuth2,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'

/** swagger方法装饰器参数 */
export interface IApiMethodOptions {
  ApiTagsOptions?: Array<string>
  ApiBasicAuthOptions?: string
  ApiBearerAuthOptions?: string
  ApiCookieAuthOptions?: string
  ApiOAuth2Options?: {
    scopes: Array<string>
    name?: string
  }
  ApiHeadersOptions?: Array<ApiHeaderOptions>
  ApiOperationOptions?: Array<ApiOperationOptions>
  ApiProducesOptions?: Array<string>
  ApiResponseOptions?: Array<ApiResponseOptions>
  ApiSecurityOptions?: {
    name: string | SecurityRequirementObject
    requirements?: Array<string>
  }
  ApiCallbacksOptions?: Array<CallBackObject<any>>
}
/**
 * swagger关于方法的装饰器融合(关于@ApiBody,@ApiParam,@ApiQuery装饰器swagger会按照@Body,@Param,@Query装饰器自动导入，所以没有封装)
 * @param apiMethodOptions swagger方法装饰器参数
 */
export function ApiMethod(apiMethodOptions: IApiMethodOptions) {
  const {
    ApiTagsOptions,
    ApiBasicAuthOptions,
    ApiBearerAuthOptions,
    ApiCookieAuthOptions,
    ApiOAuth2Options,
    ApiHeadersOptions,
    ApiOperationOptions,
    ApiProducesOptions,
    ApiResponseOptions,
    ApiSecurityOptions,
    ApiCallbacksOptions,
  } = apiMethodOptions
  const apiMethodDecorators: MethodDecorator[] = []
  if (ApiTagsOptions) apiMethodDecorators.push(ApiTags(...ApiTagsOptions))
  if (ApiBasicAuthOptions) apiMethodDecorators.push(ApiBasicAuth(ApiBasicAuthOptions))
  if (ApiBearerAuthOptions) apiMethodDecorators.push(ApiBearerAuth(ApiBearerAuthOptions))
  if (ApiCookieAuthOptions) apiMethodDecorators.push(ApiCookieAuth(ApiCookieAuthOptions))
  if (ApiOAuth2Options) apiMethodDecorators.push(ApiOAuth2(ApiOAuth2Options.scopes, ApiOAuth2Options.name))
  if (ApiHeadersOptions) apiMethodDecorators.push(ApiHeaders(ApiHeadersOptions))
  if (ApiOperationOptions) ApiOperationOptions.forEach((item) => apiMethodDecorators.push(ApiOperation(item)))
  if (ApiProducesOptions) apiMethodDecorators.push(ApiProduces(...ApiProducesOptions))
  if (ApiResponseOptions) ApiResponseOptions.forEach((item) => apiMethodDecorators.push(ApiResponse(item)))
  if (ApiSecurityOptions) apiMethodDecorators.push(ApiSecurity(ApiSecurityOptions.name, ApiSecurityOptions.requirements))
  if (ApiCallbacksOptions) apiMethodDecorators.push(ApiCallbacks(...ApiCallbacksOptions))

  return applyDecorators.apply(this, apiMethodDecorators)
}

/** swagger控制器装饰器参数 */
export interface IApiControllerOptions {
  ApiBasicAuthOptions?: string
  ApiBearerAuthOptions?: string
  ApiCookieAuthOptions?: string
  ApiOAuth2Options?: {
    scopes: Array<string>
    name?: string
  }
  ApiTagsOptions?: Array<string>
}

export function ApiController<T extends new (...args: any[]) => any>(apiControllerOptions: IApiControllerOptions) {
  const { ApiBasicAuthOptions, ApiBearerAuthOptions, ApiCookieAuthOptions, ApiOAuth2Options, ApiTagsOptions } = apiControllerOptions
  return function (Target: T) {
    if (ApiBasicAuthOptions) ApiBasicAuth(ApiBasicAuthOptions)
    if (ApiBearerAuthOptions) ApiBearerAuth(ApiBearerAuthOptions)
    if (ApiCookieAuthOptions) ApiCookieAuth(ApiCookieAuthOptions)
    if (ApiOAuth2Options) ApiOAuth2(ApiOAuth2Options.scopes, ApiOAuth2Options.name)
    if (ApiTagsOptions) ApiTags(...ApiTagsOptions)(Target)
  }
}
