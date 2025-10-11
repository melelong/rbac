import type { IDuplicationPluginConfig, ILimitPluginConfig, IUnknownErrorPluginConfig } from './plugins'
import { AxiosUtils } from './AxiosUtils'
import { DuplicationPlugin, LimitPlugin, UnknownErrorPlugin } from './plugins'

export type CustomConfig = IUnknownErrorPluginConfig & IDuplicationPluginConfig & ILimitPluginConfig
export const request = new AxiosUtils<CustomConfig>()
request.install([LimitPlugin, DuplicationPlugin, UnknownErrorPlugin], [LimitPlugin, DuplicationPlugin, UnknownErrorPlugin])
