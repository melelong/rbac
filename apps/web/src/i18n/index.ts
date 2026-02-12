import type { App } from 'vue'
import messages from '@intlify/unplugin-vue-i18n/messages'
import { useStorage } from '@vueuse/core'
import { createI18n } from 'vue-i18n'
import { useApp } from '@/store/modules/app'

export const localeKeys = ['zh-CN', 'en'] as const
export type AppLocale = (typeof localeKeys)[number]
export const i18n = createI18n({
  legacy: false,
  locale: localeKeys[0],
  fallbackLocale: localeKeys[1],
  messages,
})
export const t = i18n.global.t
/** I18N本地持久化 */
export const I18N_LOCALE = useStorage('I18N_Locale', localeKeys[0], window.localStorage)

export function initI18n() {
  const { setLocale } = useApp()
  setLocale(I18N_LOCALE.value as AppLocale)
}
export function setUpI18n(app: App<Element>) {
  app.use(i18n)
  initI18n()
}
