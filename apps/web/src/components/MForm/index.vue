<script lang="ts" setup>
import type { componentType, IFormItems, MFormProps, TComponentMap } from './IMForm'
import { h } from 'vue'
import { MButton } from '@/components'

defineOptions({ name: 'MForm' })
const props = withDefaults(defineProps<MFormProps>(), {
  gutter: 8,
  hidden: false,
  showMessage: true,
})
const _formItems = computed(() => props.formItems.filter((item) => item.hidden !== true))
const _formProps = computed(() => {
  const { formItems, formTitle, ...formProps } = props
  return formProps
})
const componentMap: TComponentMap = {
  Input: ElInput,
  Button: MButton,
  /** 用插槽 */
  Template: false,
}
const vm = getCurrentInstance()
function changeRef(instance: any) {
  if (!instance) return
  if (vm) {
    vm.exposeProxy = vm.exposed = instance || {}
  }
}
function getComponent(item: IFormItems) {
  if (typeof item.type !== 'string') return item.type
  return componentMap[item.type as componentType]
}
function getSlots(item: IFormItems) {
  if (typeof item.slots === 'string' || typeof item.slots === 'number') {
    return {
      default: () => h('span', {}, item.slots),
    }
  }
  return item.slots
}
</script>

<template>
  <div class="MForm_container">
    <slot name="mFormTitle">
      <template v-if="props.formTitle">
        <h1 class="MForm_title">
          {{ props.formTitle }}
        </h1>
      </template>
    </slot>
    <ElForm v-bind="{ ...$attrs, ..._formProps }" :ref="changeRef">
      <ElRow :gutter="props.gutter">
        <ElCol v-for="item in _formItems" :key="item.key" :span="item.span || 24">
          <ElFormItem :class="[`MForm_item_${item.key}`]" :label="item.label" :prop="item.key in props.model! ? item.key : undefined">
            <slot :name="item.key">
              <template v-if="getComponent(item)">
                <Component
                  :is="h(getComponent(item), { ...item.attrs, ...item.props }, getSlots(item))"
                  v-model="props.model![item.key as string]"
                  class="w-full"
                ></Component>
              </template>
            </slot>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
  </div>
</template>

<style>
.MForm_container {
  @apply min-h-full min-w-full px-[4px] text-center;
}
.MForm_title {
  @apply select-none py-[.5rem] text-2xl color-slate-950 font-black text-shadow-lg shadow-slate-500/40 dark:color-white dark:shadow-primary/40;
}
</style>
