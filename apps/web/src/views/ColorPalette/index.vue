<script lang="ts" setup>
import type { IColorPalette } from '@/composables'
import { useColorPalette } from '@/composables'
import { goTo } from '@/router'

defineOptions({ name: 'ColorPalette' })
const colors: Array<string> = [
  '#64748b',
  '#6b7280',
  '#71717a',
  '#737373',
  '#78716c',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
]
const { generatePalette } = useColorPalette()
const colorPalette = computed<Array<Array<IColorPalette>>>(() => colors.map((color) => generatePalette(color)))
const customColor = ref<string>('#ffffff')
const customColorPalette = computed<Array<IColorPalette>>(() => generatePalette(customColor.value))
function handleActiveChange(val?: string) {
  console.warn('handleChange')
  val && (customColor.value = val)
  return void 0
}
</script>

<template>
  <div class="ColorPalette_container max-h-full flex-col-center py-10">
    <div class="mb-10 flex-center">
      <MButton @click="goTo('Workspace')">Workspace</MButton>
    </div>
    <div class="mb-10 flex-col-center gap-1">
      <p>自定义颜色</p>
      <div class="flex gap-1">
        <div
          v-for="{ text, color, num } in customColorPalette"
          :key="color"
          class="h-[70px] w-[140px] select-none border rounded-[4px] p-1 text-center text-[12px] font-100"
          :style="`color:${text};background-color:${color};`"
        >
          <div>{{ num }}</div>
          <div>背景颜色: {{ color }}</div>
          <div>文字颜色: {{ text }}</div>
        </div>
      </div>
      <ElColorPicker v-model="customColor" @active-change="handleActiveChange" />
    </div>
    <div class="mb-10 flex-col-center gap-1">
      <p>类tailwindcss颜色</p>
      <div class="h-[calc(140px_+_0.25rem_*_3)] overflow-auto border">
        <div class="flex-col-center gap-1 overflow-hidden p-1">
          <div v-for="(palette, index) in colorPalette" :key="index" class="flex gap-1">
            <div
              v-for="{ text, color, num } in palette"
              :key="color"
              class="h-[70px] w-[140px] select-none border rounded-[4px] p-1 text-center text-[12px] font-100"
              :style="`color:${text};background-color:${color};`"
            >
              <div>{{ num }}</div>
              <div>背景颜色: {{ color }}</div>
              <div>文字颜色: {{ text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class=""></div>
  </div>
</template>
