<script lang="ts" setup>
import type { ElColorPicker } from 'element-plus'
import { Icon } from '@iconify/vue'
import { t } from '@/i18n'

defineOptions({ name: 'MThemeBtn' })
const MThemeBtnRef = useTemplateRef<HTMLDivElement>('MThemeBtnRef')
const ElColorPickerRef = useTemplateRef<InstanceType<typeof ElColorPicker>>('ElColorPickerRef')
const color = ref('')
const changing = ref<boolean>(false)
const showColorPicker = ref<boolean>(false)
function handleHover() {
  if (changing.value) return void 0
  showColorPicker.value = !showColorPicker.value
}
onMounted(() => {
  MThemeBtnRef.value?.addEventListener('mouseenter', handleHover)
  MThemeBtnRef.value?.addEventListener('mouseleave', handleHover)
})
onUnmounted(() => {
  MThemeBtnRef.value?.removeEventListener('mouseenter', handleHover)
  MThemeBtnRef.value?.removeEventListener('mouseleave', handleHover)
})
function handleFocus() {
  changing.value = true
  showColorPicker.value = true
}
function handleBlur() {
  changing.value = false
  showColorPicker.value = false
}
function handleActiveChange(val?: string) {
  if (!val) return void 0
  console.warn('handleActiveChange')
  return void 0
}
function handleChange() {
  console.warn('handleChange')
  changing.value = false
  showColorPicker.value = false
}
</script>

<template>
  <div ref="MThemeBtnRef" class="MThemeBtn_container flex">
    <ElColorPicker
      v-if="showColorPicker"
      ref="ElColorPickerRef"
      v-model="color"
      color-format="hex"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      @active-change="handleActiveChange"
    />
    <ElTooltip :auto-close="200" placement="bottom" :content="t('components.MThemeBtn.content')">
      <ElButton class="z-1 m-0 flex-center border-none">
        <template #icon>
          <Icon class="cursor-pointer color-primary" icon="icon-park-outline:color-filter" />
        </template>
      </ElButton>
    </ElTooltip>
  </div>
</template>
