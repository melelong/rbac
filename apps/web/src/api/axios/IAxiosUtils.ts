import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CancelToken,
  CancelTokenSource,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios'
/** 请求ID生成规则类型 */
export type TRequestIdRules = 'uuid' | 'default' | 'method:url:params' | 'method:url:data' | 'method:url'
/** 请求配置 */
export interface IRequest<C = any> extends AxiosRequestConfig {
  /** 请求ID生成规则 */
  requestIdRules?: TRequestIdRules
  /** 请求ID */
  requestId?: string
  /** 取消令牌资源 */
  cancelTokenSource?: CancelTokenSource
  /** 取消令牌 */
  cancelToken?: CancelToken
  /** 自定义配置 */
  customConfig?: C
}

/** 响应结果 */
export interface IResponse<T = any, D = any> extends AxiosResponse<T, D> {}
/** 自定义请求 */
export type CustomAxiosRequest<C = any> = IRequest<C> & InternalAxiosRequestConfig
/** 自定义响应 */
export type CustomAxiosResponse<C = any, T = any, D = any> = IResponse<T, D> & {
  config: IRequest<C>
}
/** 自定义错误类型 */
export type CustomAxiosError<C = any> = AxiosError & {
  config?: IRequest<C>
}

export interface IPluginError {
  code: string
  message: string
  data: null
}

/** 插件接口 */
export interface IHttpPlugin {
  /** 插件名 */
  name: string
  /**
   * 请求配置处理
   * @param config 请求配置
   * @returns 处理过后的请求配置
   */
  request?: <C = any>(config: CustomAxiosRequest<C>) => Promise<CustomAxiosRequest<C> | null>
  /**
   * 请求错误处理
   * @param error 错误对象
   * @returns 处理过后的错误对象
   */
  requestError?: <C = any>(error: CustomAxiosError<C>) => Promise<CustomAxiosError<C> | null | IPluginError>
  /**
   * 响应处理
   * @param response 响应对象
   * @returns 处理过后的响应对象
   */
  response?: <C = any, T = any, D = any>(response: CustomAxiosResponse<C, T, D>) => Promise<CustomAxiosResponse<C, T, D> | null>
  /**
   * 响应错误处理
   * @param error 错误对象
   * @returns 处理过后的错误对象
   */
  responseError?: <C = any>(error: CustomAxiosError<C>) => Promise<CustomAxiosError<C> | null | IPluginError>
}

/** axios实例配置项 */
export interface IAxiosUtilsOptions<C = any> extends CreateAxiosDefaults {
  /** 请求ID生成规则 */
  requestIdRules?: TRequestIdRules
  /** 自定义配置 */
  customConfig?: C
}
export interface IPluginHandlerItem<T> {
  name: string
  handler: T
}
export interface IPluginList {
  pluginNames: string[]
  request: Array<IPluginHandlerItem<NonNullable<IHttpPlugin['request']>>>
  requestError: Array<IPluginHandlerItem<NonNullable<IHttpPlugin['requestError']>>>
  response: Array<IPluginHandlerItem<NonNullable<IHttpPlugin['response']>>>
  responseError: Array<IPluginHandlerItem<NonNullable<IHttpPlugin['responseError']>>>
}

export interface IAxiosUtils<C = any> {
  /** 插件列表 */
  plugins: IPluginList
  /** 合并后配置项 */
  mergedConfig: IAxiosUtilsOptions
  /**
   * 初始化
   * @param options 配置项
   */
  _init: (options: IAxiosUtilsOptions<C>) => void
  /**
   * 安装单个请求插件
   * @param plugin 插件
   */
  useRequest: (plugin: IHttpPlugin) => void
  /**
   * 卸载单个请求插件
   * @param name 插件名
   */
  ejectRequest: (name: string) => void
  /**
   * 安装单个响应插件
   * @param plugin 插件
   */
  useResponse: (plugin: IHttpPlugin) => void
  /**
   * 卸载单个响应插件
   * @param name 插件名
   */
  ejectResponse: (name: string) => void
  /**
   * 安装多个插件
   * @param requestPlugins 请求插件列表
   * @param responsePlugins 响应插件列表
   */
  install: (requestPlugins?: IHttpPlugin[], responsePlugins?: IHttpPlugin[]) => void
  /**
   * 卸载多个插件
   * @param requestPluginNames 请求插件名列表
   * @param responsePluginNames 响应插件名列表
   */
  uninstall: (requestPluginNames?: string[], responsePluginNames?: string[]) => void
}
