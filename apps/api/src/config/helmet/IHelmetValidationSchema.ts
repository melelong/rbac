/** 跨域策略类型 */
export const CROSS_ORIGIN_OPENER_POLICY_TYPE = ['same-origin-allow-popups', 'same-origin', 'unsafe-none'] as const
/** helmet配置验证接口 */
export interface IHelmetValidationSchema {
  HELMET_ENABLED: boolean
  HELMET_CROSS_ORIGIN_OPENER_POLICY: (typeof CROSS_ORIGIN_OPENER_POLICY_TYPE)[number]
  HELMET_CROSS_ORIGIN_RESOURCE_POLICY: boolean
  HELMET_CONTENT_SECURITY_POLICY: boolean
}
