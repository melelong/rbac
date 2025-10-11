import type { IErrorResponse, IOKResponse } from '@packages/types'
import type { AxiosInstance } from 'axios'
import type {
  CustomAxiosError,
  CustomAxiosRequest,
  CustomAxiosResponse,
  IAxiosUtils,
  IAxiosUtilsOptions,
  IHttpPlugin,
  IPluginError,
  IPluginList,
  IRequest,
} from './IAxiosUtils'
import axios from 'axios'
import { v4 as uuidV4 } from 'uuid'

export class AxiosUtils<T = any> implements IAxiosUtils<T> {
  plugins: IPluginList = {
    pluginNames: [],
    request: [],
    requestError: [],
    response: [],
    responseError: [],
  }

  /** AxiosUtils实例 */
  instance: AxiosUtils | null = null
  /** axios实例 */
  private axiosInstance: AxiosInstance | null = null
  public static CancelToken = axios.CancelToken
  /** 默认配置项 */
  public static defaultConfig: IAxiosUtilsOptions = {
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:4001/dev',
    timeout: 2000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
    customConfig: {},
  }

  mergedConfig: IAxiosUtilsOptions<T>

  constructor(options?: IAxiosUtilsOptions<T>) {
    this.mergedConfig = {
      ...AxiosUtils.defaultConfig,
      ...(options ?? {}),
    }
    this._init()
  }

  _init() {
    this.axiosInstance = axios.create(this.mergedConfig)
    this.axiosInstance.interceptors.request.use(
      async (config: CustomAxiosRequest) => {
        // 为每个请求注入请求ID,取消令牌资源和取消令牌
        const requestId = AxiosUtils.generateRequestId(config)
        config.requestId = requestId
        config.cancelTokenSource = AxiosUtils.CancelToken.source()
        config.cancelToken = config.cancelTokenSource.token

        // 运行插件
        let cache: CustomAxiosRequest | null = config
        const list = this.plugins.request
        for (const item of list) {
          const _config = (await item.handler(cache)) as CustomAxiosRequest | null
          if (_config) cache = _config
        }
        return cache
      },
      async (error: CustomAxiosError) => {
        let cache: CustomAxiosError | null = error
        const list = this.plugins.requestError
        for (const item of list) {
          const _error = (await item.handler(cache)) as CustomAxiosError | null
          if (_error) cache = _error
        }
        return Promise.reject(cache)
      },
    )
    this.axiosInstance.interceptors.response.use(
      async (response: CustomAxiosResponse) => {
        let cache: CustomAxiosResponse | null = response
        const list = this.plugins.response
        for (const item of list) {
          const _response = (await item.handler(cache)) as CustomAxiosResponse | null
          if (_response) cache = _response
        }
        return cache
      },
      async (error: CustomAxiosError) => {
        let cache: CustomAxiosError | null = error
        const list = this.plugins.responseError
        for (const item of list) {
          const _error = (await item.handler(cache)) as CustomAxiosError | null
          if (_error) cache = _error
        }
        return Promise.reject(cache)
      },
    )
  }

  /**
   * 创建插件错误
   * @param name 插件名
   * @param message 错误信息
   */
  public static createPluginError(name: string, message: string): IPluginError {
    return {
      code: `${name}Error`,
      message,
      data: null,
    }
  }

  useRequest(plugin: IHttpPlugin) {
    const key = plugin.name
    const pluginName = `request:${key}`
    const request = this.plugins.request
    const requestError = this.plugins.requestError
    const pluginNames = this.plugins.pluginNames
    const isExist = pluginNames.findIndex((item) => item === key)
    if (isExist !== -1) throw new Error(`${key} request插件已存在`)
    if (!plugin.request && !plugin.requestError) throw new Error(`${key} request插件安装失败`)
    // 收集该插件的request安装到插件列表中
    if (plugin.request) {
      request.push({ name: key, handler: plugin.request })
      pluginNames.push(pluginName)
    }
    // 收集该插件的requestError安装到插件列表中
    if (plugin.requestError) {
      requestError.push({ name: key, handler: plugin.requestError })
      pluginNames.push(pluginName)
    }
  }

  ejectRequest(name: string) {
    const pluginName = `request:${name}`
    const request = this.plugins.request
    const requestError = this.plugins.requestError
    const pluginNames = this.plugins.pluginNames
    const isExist = pluginNames.findIndex((item) => item === pluginName)
    if (isExist === -1) throw new Error(`${name} request插件不存在`)
    const requestIndex = request.findIndex((item) => item.name === name)
    if (requestIndex !== -1) request.splice(requestIndex, 1)
    const requestErrorIndex = requestError.findIndex((item) => item.name === name)
    if (requestErrorIndex !== -1) requestError.splice(requestErrorIndex, 1)
    const pluginIndex = pluginNames.findIndex((item) => item === pluginName)
    if (pluginIndex !== -1) pluginNames.splice(pluginIndex, 1)
  }

  useResponse(plugin: IHttpPlugin) {
    const key = plugin.name
    const pluginName = `response:${key}`
    const response = this.plugins.response
    const responseError = this.plugins.responseError
    const pluginNames = this.plugins.pluginNames
    const isExist = pluginNames.findIndex((item) => item === pluginName)
    if (isExist !== -1) throw new Error(`${key} response插件已存在`)
    if (!plugin.response && !plugin.responseError) throw new Error(`${key} response插件安装失败`)
    // 收集该插件的response安装到插件列表中
    if (plugin.response) {
      response.push({ name: key, handler: plugin.response })
      pluginNames.push(pluginName)
    }
    // 收集该插件的responseError安装到插件列表中
    if (plugin.responseError) {
      responseError.push({ name: key, handler: plugin.responseError })
      pluginNames.push(pluginName)
    }
  }

  ejectResponse(name: string) {
    const pluginName = `response:${name}`
    const response = this.plugins.response
    const responseError = this.plugins.responseError
    const pluginNames = this.plugins.pluginNames
    const isExist = pluginNames.findIndex((item) => item === pluginName)
    if (isExist === -1) throw new Error(`${name} response插件不存在`)
    const responseIndex = response.findIndex((item) => item.name === name)
    if (responseIndex !== -1) response.splice(responseIndex, 1)
    const responseErrorIndex = responseError.findIndex((item) => item.name === name)
    if (responseErrorIndex !== -1) responseError.splice(responseErrorIndex, 1)
    const pluginIndex = pluginNames.findIndex((item) => item === pluginName)
    if (pluginIndex !== -1) pluginNames.splice(pluginIndex, 1)
  }

  install(requestPlugins: IHttpPlugin[] = [], responsePlugins: IHttpPlugin[] = []) {
    if (requestPlugins.length > 0) {
      for (let i = 0; i < requestPlugins.length; i++) {
        this.useRequest(requestPlugins[i])
      }
    }
    if (responsePlugins.length > 0) {
      for (let i = 0; i < responsePlugins.length; i++) {
        this.useResponse(responsePlugins[i])
      }
    }
  }

  uninstall(requestPluginNames: string[] = [], responsePluginNames: string[] = []) {
    if (requestPluginNames.length > 0) {
      for (let i = 0; i < requestPluginNames.length; i++) {
        this.ejectRequest(requestPluginNames[i])
      }
    }
    if (responsePluginNames.length > 0) {
      for (let i = 0; i < responsePluginNames.length; i++) {
        this.ejectResponse(responsePluginNames[i])
      }
    }
  }

  public static generateRequestId<C = any>(config: CustomAxiosRequest<C>) {
    const rule = config.requestIdRules ?? 'default'
    if (rule === 'uuid') return uuidV4()
    const { url, method, params, data } = config
    const _JSON = (d: any) => (d ? JSON.stringify(d) : 'null')
    switch (rule) {
      case 'method:url:params':
        return `${method}:${url}?${_JSON(params)}`
      case 'method:url:data':
        return `${method}:${url}&${_JSON(data)}`
      case 'method:url':
        return `${method}:${url}`
      default:
        return `${method}:${url}?${_JSON(params)}&${_JSON(data)}`
    }
  }

  public async request<C = any, VO = any, R = IOKResponse<VO> | IErrorResponse>(config: IRequest<C>): Promise<R> {
    try {
      const response = await this.axiosInstance!.request<R>(config)
      return response?.data as R
    } catch (error) {
      return Promise.reject(error)
    }
  }

  public async get<C = any, VO = any, DTO = any>(url: string, params?: DTO, config?: IRequest<C>) {
    const response = await this.request<C, VO>({ url, method: 'get', params, ...config })
    return response as typeof response
  }

  public async post<C = any, VO = any, DTO = any>(url: string, data?: DTO, config?: IRequest<C>) {
    const response = await this.request<C, VO>({ url, method: 'post', data, ...config })
    return response as typeof response
  }

  public async delete<C = any, VO = any, DTO = any>(url: string, data?: DTO, config?: IRequest<C>) {
    const response = await this.request<C, VO>({ url, method: 'delete', data, ...config })
    return response as typeof response
  }

  public async patch<C = any, VO = any, DTO = any>(url: string, data?: DTO, config?: IRequest<C>) {
    const response = await this.request<C, VO>({ url, method: 'patch', data, ...config })
    return response as typeof response
  }
}
