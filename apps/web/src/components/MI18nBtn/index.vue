<script lang="ts" setup>
import type { AppLocale } from '@/i18n'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import { localeKeys, t } from '@/i18n'
import { useApp } from '@/store/modules/app'

defineOptions({ name: 'MI18nBtn' })
const route = useRoute()
const app = useApp()
const { setLocale, setTitle } = app
function _setLocale(locale: AppLocale) {
  setLocale(locale)
  setTitle(route.meta.title as string)
  ElMessage({
    message: t(`common.locale.${locale}`),
    type: 'success',
    duration: 1000,
  })
}
</script>

<template>
  <ElTooltip :auto-close="500" placement="bottom" :content="t('components.MI18nBtn.content')">
    <ElDropdown size="large" placement="bottom" trigger="click" popper-class="MI18nBtn_container">
      <ElButton class="m-0 border-none">
        <template #icon>
          <Icon icon="icon-park-outline:translate" class="cursor-pointer color-black dark:color-white" />
        </template>
      </ElButton>
      <template v-if="localeKeys.length > 0" #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem v-for="item in localeKeys" :key="item" :disabled="app.locale === item" @click="_setLocale(item)">
            {{ t(`common.locale.${item}`) }}
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </ElTooltip>
</template>
