import type { ICustomAxiosError, ICustomAxiosResponse, ICustomInternalAxiosRequestConfig, IHttpUtils } from './IHttpUtils'

export type THttpUtilsPluginHook = 'onReq' | 'onReqErr' | 'onRes' | 'onResErr'
/** 插件钩子数据类型映射 */
export type TPluginHookData<C, H extends THttpUtilsPluginHook> = H extends 'onReq'
  ? ICustomInternalAxiosRequestConfig<C>
  : H extends 'onReqErr'
    ? ICustomAxiosError<C>
    : H extends 'onRes'
      ? ICustomAxiosResponse<C>
      : H extends 'onResErr'
        ? ICustomAxiosError<C>
        : never
/** 插件上下文接口 */
export interface IHttpUtilsPluginCTX<C = any> {
  getPlugins: IHttpUtils<C>['getPlugins']
  setPlugin: IHttpUtils<C>['setPlugin']
  delPlugin: IHttpUtils<C>['delPlugin']
  getPlugin: IHttpUtils<C>['getPlugin']
  clearPlugins: IHttpUtils<C>['clearPlugins']
  defaultConfig: IHttpUtils<C>['defaultConfig']
  generateRequestId: IHttpUtils<C>['generateRequestId']
  request: IHttpUtils<C>['request']
  get: IHttpUtils<C>['get']
  post: IHttpUtils<C>['post']
  delete: IHttpUtils<C>['delete']
  put: IHttpUtils<C>['put']
  patch: IHttpUtils<C>['patch']
}
/** 插件钩子优先级 */
export interface IHttpUtilsPluginPriority {
  /** 请求拦截优先级 */
  onReq?: number
  /** 请求错误处理优先级 */
  onReqErr?: number
  /** 响应拦截优先级 */
  onRes?: number
  /** 响应错误处理优先级 */
  onResErr?: number
  /** 默认优先级（当特定钩子未设置时使用） */
  default?: number
}
/** 插件接口 */
export interface IHttpUtilsPlugin<C = any> {
  /** 插件名 */
  name: string
  /** 插件优先级配置 */
  priority?: IHttpUtilsPluginPriority | number
  /** 插件配置 */
  config?: C
  /** 请求拦截钩子 */
  onReq?: (
    config: ICustomInternalAxiosRequestConfig<C>,
    ctx: IHttpUtilsPluginCTX<C>,
  ) => ICustomInternalAxiosRequestConfig<C> | Promise<ICustomInternalAxiosRequestConfig<C>>
  /** 请求拦截异常钩子 */
  onReqErr?: (err: ICustomAxiosError<C>, ctx: IHttpUtilsPluginCTX<C>) => ICustomAxiosError<C> | Promise<ICustomAxiosError<C>> | any
  /** 响应拦截钩子 */
  onRes?: (res: ICustomAxiosResponse<C>, ctx: IHttpUtilsPluginCTX<C>) => ICustomAxiosResponse<C> | Promise<ICustomAxiosResponse<C>>
  /** 响应拦截异常钩子 */
  onResErr?: (err: ICustomAxiosError<C>, ctx: IHttpUtilsPluginCTX<C>) => ICustomAxiosError<C> | Promise<ICustomAxiosError<C>> | any
}
