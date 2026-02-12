import type { BasicColorMode, UseColorModeReturn } from '@vueuse/core'
import { useColorMode, useCycleList } from '@vueuse/core'

export interface IModeState {
  /** 模式 */
  mode: UseColorModeReturn<BasicColorMode>
  /** 切换下一个模式 */
  next: (n?: number) => 'light' | 'dark' | 'auto'
  /** 是否为暗黑模式 */
  isDark: globalThis.ComputedRef<boolean>
}
export const useMode = defineStore('MODE', {
  state: (): IModeState => {
    const mode = useColorMode({ emitAuto: true })
    const { state, next } = useCycleList(['dark', 'auto', 'light'] as const, { initialValue: mode })
    watchEffect(() => (mode.value = state.value))
    const isDark = computed(() => {
      const _mode = mode.store.value === 'auto' ? mode.system.value : mode.store.value
      return _mode === 'dark'
    })
    return { mode, next, isDark }
  },
  actions: {
    /** 切换模式 */
    toggleMode(e: MouseEvent) {
      const old = this.isDark
      if (!document.startViewTransition) return this.next()
      const transition = document.startViewTransition(this.next)
      transition.ready.then(() => {
        if (old === this.isDark) return
        const { clientX, clientY } = e
        const radius = Math.hypot(Math.max(clientX, innerWidth - clientX), Math.max(clientY, innerHeight - clientY))
        const clipPath = [`circle(0px at ${clientX}px ${clientY}px)`, `circle(${radius}px at ${clientX}px ${clientY}px)`]
        document.documentElement.animate(
          { clipPath: this.isDark ? clipPath.reverse() : clipPath },
          { duration: 500, pseudoElement: this.isDark ? '::view-transition-old(root)' : '::view-transition-new(root)' },
        )
      })
    },
  },
})
