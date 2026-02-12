import type { IOKResponse } from '@packages/types'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type {
  ICustomAxiosError,
  ICustomAxiosRequestConfig,
  ICustomAxiosResponse,
  ICustomInternalAxiosRequestConfig,
  IHttpUtils,
  IHttpUtilsOptions,
} from './IHttpUtils'
import type { IHttpUtilsPlugin, IHttpUtilsPluginCTX, THttpUtilsPluginHook, TPluginHookData } from './IPlugin'
import axios from 'axios'
import { v4 } from 'uuid'
import { REQUEST_ID_RULES } from './IHttpUtils'

export class HttpUtils<C = any> implements IHttpUtils<C> {
  axiosInstance!: AxiosInstance
  public defaultConfig: IHttpUtilsOptions = {
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:4001/api',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
    customConfig: {},
  }

  constructor(options?: IHttpUtilsOptions<C>) {
    /** 合并配置 */
    Object.assign(this.defaultConfig, options ?? {})
    this._init()
  }

  /** 初始化axios实例 */
  private _init() {
    this.axiosInstance = axios.create(this.defaultConfig)
    const onReq = async (config: ICustomInternalAxiosRequestConfig<C>) => {
      config = await this.runHook('onReq', config)
      return config
    }
    const onReqErr = async (err: ICustomAxiosError<C>) => {
      err = await this.runHook('onReqErr', err)
      return err
    }
    const onRes = async (res: ICustomAxiosResponse<C>) => {
      res = await this.runHook('onRes', res)
      return res
    }
    const onResErr = async (err: ICustomAxiosError<C>) => {
      err = await this.runHook('onResErr', err)
      return err
    }
    const { request, response } = this.axiosInstance.interceptors
    request.use(onReq, onReqErr)
    response.use(onRes, onResErr)
  }

  // 插件相关
  public plugins: IHttpUtilsPlugin<C>[] = []
  ctx: IHttpUtilsPluginCTX<C> = {
    getPlugins: this.getPlugins.bind(this),
    setPlugin: this.setPlugin.bind(this),
    delPlugin: this.delPlugin.bind(this),
    getPlugin: this.getPlugin.bind(this),
    clearPlugins: this.clearPlugins.bind(this),
    defaultConfig: this.defaultConfig,
    generateRequestId: this.generateRequestId.bind(this),
    request: this.request.bind(this),
    get: this.get.bind(this),
    post: this.post.bind(this),
    delete: this.delete.bind(this),
    put: this.put.bind(this),
    patch: this.patch.bind(this),
  }

  async setPlugin(plugin: IHttpUtilsPlugin<C>) {
    const oldLength = this.plugins.length
    if (!this.plugins.find((p) => p.name === plugin.name)) this.plugins.push(plugin)

    return oldLength !== this.plugins.length
  }

  getPlugins() {
    return this.plugins ?? null
  }

  delPlugin(plugin: IHttpUtilsPlugin<C>) {
    const oldLength = this.plugins.length
    this.plugins = this.plugins.filter((p) => p.name !== plugin.name)
    return oldLength !== this.plugins.length
  }

  getPlugin(pluginName: string) {
    return this.plugins.find((p) => p.name === pluginName) ?? null
  }

  clearPlugins() {
    this.plugins.length = 0
  }

  getPluginPriority(plugin: IHttpUtilsPlugin<C>, hook: THttpUtilsPluginHook) {
    const { priority } = plugin
    if (typeof priority === 'number') return priority
    if (typeof priority === 'object') return priority[hook] ?? priority.default ?? 0
    return 0
  }

  sortPlugins(plugins: IHttpUtilsPlugin<C>[], hook: THttpUtilsPluginHook) {
    // 插件多了之后考虑缓存排序结果
    return [...plugins].sort((a, b) => this.getPluginPriority(a, hook) - this.getPluginPriority(b, hook))
  }

  async runHook<H extends THttpUtilsPluginHook>(hook: H, data: TPluginHookData<C, H>) {
    const sortedPlugins = this.sortPlugins(this.plugins, hook)
    let currentData = data

    for (const plugin of sortedPlugins) {
      // eslint-disable-next-line ts/no-unsafe-function-type
      const pluginHook = plugin[hook] as Function | undefined
      if (pluginHook) {
        try {
          const result = await pluginHook(currentData, this.ctx)
          if (result !== undefined && result !== null) {
            currentData = result as TPluginHookData<C, H>
          }
        } catch (err) {
          console.error(`[HttpUtils] Plugin "${plugin.name}" ${hook} failed:`, err)
          // 继续执行下一个插件，保持系统稳定性
          continue
        }
      }
    }

    return currentData
  }

  // 请求相关
  public generateRequestId(config: ICustomAxiosRequestConfig<C>) {
    const rule = config?.requestIdRules ?? REQUEST_ID_RULES.METHOD_URL_PARAMS_DATA
    if (rule === REQUEST_ID_RULES.UUID) return v4()
    const { method, url, params, data } = config
    const _JSON = (d: any) => (d ? JSON.stringify(d) : 'null')
    switch (rule) {
      case REQUEST_ID_RULES.METHOD_URL_PARAMS:
        return `${method}:${url}?${_JSON(params)}`
      case REQUEST_ID_RULES.METHOD_URL_DATA:
        return `${method}:${url}&${_JSON(data)}`
      case REQUEST_ID_RULES.METHOD_URL:
        return `${method}:${url}`
      default:
        return `${method}:${url}?${_JSON(params)}&${_JSON(data)}`
    }
  }

  public async request<DTO = any, VO = never[]>(config: ICustomAxiosRequestConfig<C, DTO>) {
    const res = await this.axiosInstance!.request<VO, AxiosResponse<IOKResponse<VO>>, DTO>(config)
    return res.data
  }

  public async get<DTO = any, VO = never[]>(url: string, params?: DTO, config?: ICustomAxiosRequestConfig<C, DTO>) {
    const res = await this.request<DTO, VO>({ url, method: 'get', params, ...config })
    return res
  }

  public async post<DTO = any, VO = never[]>(url: string, data?: DTO, config?: ICustomAxiosRequestConfig<C, DTO>) {
    const res = await this.request<DTO, VO>({ url, method: 'post', data, ...config })
    return res
  }

  public async delete<DTO = any, VO = never[]>(url: string, data?: DTO, config?: ICustomAxiosRequestConfig<C, DTO>) {
    const res = await this.request<DTO, VO>({ url, method: 'delete', data, ...config })
    return res
  }

  public async put<DTO = any, VO = never[]>(url: string, data?: DTO, config?: ICustomAxiosRequestConfig<C, DTO>) {
    const res = await this.request<DTO, VO>({ url, method: 'put', data, ...config })
    return res
  }

  public async patch<DTO = any, VO = never[]>(url: string, data?: DTO, config?: ICustomAxiosRequestConfig<C, DTO>) {
    const res = await this.request<DTO, VO>({ url, method: 'patch', data, ...config })
    return res
  }
}
