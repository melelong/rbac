<script lang="ts" setup>
import type { MButtonProps } from './IMButton'
import { Icon } from '@iconify/vue'
import { ElButton } from 'element-plus'
import { h } from 'vue'

defineOptions({ name: 'MButton' })
const props = withDefaults(defineProps<MButtonProps>(), {
  async: false,
})
function getSlot(slots: InstanceType<typeof ElButton>['$slots']) {
  return {
    ...slots,
    loading: () => h(Icon, { icon: 'icon-park-outline:loading-four', class: 'loading-icon' }),
  }
}
const vm = getCurrentInstance()

function changeRef(instance: any) {
  if (!instance) return
  if (vm) {
    vm.exposeProxy = vm.exposed = instance || {}
  }
}
</script>

<template>
  <Component :is="h(ElButton, { ...$attrs, ...props }, getSlot($slots))" :ref="changeRef"></Component>
</template>

<style scoped>
.el-button {
  --shadow-num: 3px;
  --shadow-a: 0.4;
  --click-shadow: var(--primary-color-400);
  --n-1: ease-in-out;
}
.el-button.el-button--success {
  --click-shadow: var(--success-color-400);
}
.el-button.el-button--warning {
  --click-shadow: var(--warning-color-400);
}
.el-button.el-button--danger {
  --click-shadow: var(--danger-color-400);
}
.el-button.el-button--info {
  --click-shadow: var(--info-color-400);
}

.el-button:active {
  animation: click-shadow 1s infinite ease-in-out;
}
.el-button:hover {
  box-shadow: 0 0 0 1px rgb(var(--click-shadow) / 1);
}
.el-button.is-disabled:active {
  animation: none;
}
.el-button.is-disabled:hover {
  box-shadow: none;
}

@keyframes click-shadow {
  0% {
    box-shadow: 0 0 0 var(--shadow-num) rgb(var(--click-shadow) / var(--shadow-a));
  }
  50% {
    box-shadow: 0 0 0 0 rgb(var(--click-shadow) / var(--shadow-a));
  }
  100% {
    box-shadow: 0 0 0 var(--shadow-num) rgb(var(--click-shadow) / var(--shadow-a));
  }
}
.loading-icon {
  animation: rotate 400ms infinite linear;
  @apply mr-1;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
