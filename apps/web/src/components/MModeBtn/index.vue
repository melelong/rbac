<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { t } from '@/i18n'
import { useMode } from '@/store'

defineOptions({ name: 'MModeBtn' })
const theme = useMode()
</script>

<template>
  <ElTooltip :auto-close="200" placement="bottom" :content="t('components.MModeBtn.content')">
    <ElButton class="MModeBtn_container m-0 flex-center border-none" @click="theme.toggleMode">
      <template #icon>
        <Icon v-if="theme.mode === 'light'" icon="icon-park-outline:sun-one" class="color-black" />
        <Icon v-if="theme.mode === 'auto'" icon="icon-park-outline:laptop-computer" class="color-black dark:color-white" />
        <Icon v-if="theme.mode === 'dark'" icon="icon-park-outline:moon" class="color-white" />
      </template>
    </ElButton>
  </ElTooltip>
</template>
