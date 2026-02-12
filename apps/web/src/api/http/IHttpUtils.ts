import type { IOKResponse } from '@packages/types'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios'
import type { IHttpUtilsPlugin, IHttpUtilsPluginCTX, THttpUtilsPluginHook, TPluginHookData } from './IPlugin'

/** 请求ID生成规则 */
export const REQUEST_ID_RULES = {
  /** uuid */
  UUID: 'UUID',
  /** 请求方法,url,params,data生成 */
  METHOD_URL_PARAMS_DATA: 'METHOD_URL_PARAMS_DATA',
  /** 请求方法,url,params生成 */
  METHOD_URL_PARAMS: 'METHOD_URL_PARAMS',
  /** 请求方法,url,data生成 */
  METHOD_URL_DATA: 'METHOD_URL_DATA',
  /** 请求方法,url生成 */
  METHOD_URL: 'METHOD_URL',
} as const
export type TRequestIdRules = (typeof REQUEST_ID_RULES)[keyof typeof REQUEST_ID_RULES]
/** 扩展配置 */
export interface IExtendConfig<C = any> {
  /** 请求ID生成规则 */
  requestIdRules?: TRequestIdRules
  /** 请求ID */
  requestId?: string
  /** 自定义配置 */
  customConfig?: C
}
/** 重写axios内部请求配置接口(请求拦截器回调参数) */
export interface ICustomInternalAxiosRequestConfig<C = any> extends InternalAxiosRequestConfig, IExtendConfig<C> {}
/** 重写axios响应配置接口(响应拦截器回调参数) */
export interface ICustomAxiosResponse<C = any> extends AxiosResponse {
  config: ICustomInternalAxiosRequestConfig<C>
}
/** 重写axios错误接口(错误拦截器回调参数) */
export interface ICustomAxiosError<C = any> extends AxiosError {
  config?: ICustomInternalAxiosRequestConfig<C>
  response?: ICustomAxiosResponse<C>
}
/** 重写axios请求配置接口(请求方法参数) */
export interface ICustomAxiosRequestConfig<C = any, DTO = any> extends AxiosRequestConfig<DTO>, IExtendConfig<C> {}
/** 重写axios配置接口(创建实例参数) */
export interface IHttpUtilsOptions<C = any> extends CreateAxiosDefaults, IExtendConfig<C> {}

export interface IHttpUtils<C = any> {
  /** axios实例 */
  axiosInstance: AxiosInstance
  /** 默认配置 */
  defaultConfig: IHttpUtilsOptions<C>
  /** 插件列表 */
  plugins: IHttpUtilsPlugin<C>[]
  /** 暴漏给插件使用的上下文 */
  ctx: IHttpUtilsPluginCTX<C>
  /** 获取插件列表 */
  getPlugins: () => IHttpUtilsPlugin<C>[] | null
  /** 设置插件 */
  setPlugin: (plugin: IHttpUtilsPlugin<C>) => Promise<boolean>
  /** 删除插件 */
  delPlugin: (plugin: IHttpUtilsPlugin<C>) => boolean
  /** 获取插件 */
  getPlugin: (pluginName: string) => IHttpUtilsPlugin<C> | null
  /** 清空插件 */
  clearPlugins: () => void
  /** 获取插件优先级 */
  getPluginPriority: (plugin: IHttpUtilsPlugin<C>, hook: THttpUtilsPluginHook) => number
  /** 排序后的插件列表 */
  sortPlugins: (plugins: IHttpUtilsPlugin<C>[], hook: THttpUtilsPluginHook) => IHttpUtilsPlugin<C>[]
  /** 运行插件钩子 */
  runHook: <H extends THttpUtilsPluginHook>(hook: H, data: TPluginHookData<C, H>) => Promise<TPluginHookData<C, H>>
  /** 生成请求ID */
  generateRequestId: (config: ICustomAxiosRequestConfig<C>) => string
  /** 基础请求 */
  request: <VO = any, DTO = any>(config: ICustomAxiosRequestConfig<C, DTO>) => Promise<IOKResponse<VO>>
  /** get请求 */
  get: <VO = any, DTO = any>(url: string, params?: DTO, config?: ICustomAxiosRequestConfig<C, DTO>) => Promise<IOKResponse<VO>>
  /** post请求 */
  post: <VO = any, DTO = any>(url: string, data?: DTO, config?: ICustomAxiosRequestConfig<C, DTO>) => Promise<IOKResponse<VO>>
  /** delete请求 */
  delete: <VO = any, DTO = any>(url: string, data?: DTO, config?: ICustomAxiosRequestConfig<C, DTO>) => Promise<IOKResponse<VO>>
  /** put请求 */
  put: <VO = any, DTO = any>(url: string, data?: DTO, config?: ICustomAxiosRequestConfig<C, DTO>) => Promise<IOKResponse<VO>>
  /** patch请求 */
  patch: <VO = any, DTO = any>(url: string, data?: DTO, config?: ICustomAxiosRequestConfig<C, DTO>) => Promise<IOKResponse<VO>>
}
