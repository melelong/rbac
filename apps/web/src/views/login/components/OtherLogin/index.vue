<script lang="ts" setup>
import type { IOtherLoginProps } from './IOtherLogin'
import { Icon } from '@iconify/vue'
import { t } from '@/i18n'

defineOptions({ name: 'OtherLogin' })
const props = defineProps<IOtherLoginProps>()
</script>

<template>
  <div class="OtherLogin_container">
    <ElDivider content-position="center" class="OtherLogin_divider">{{ t('views.Login.components.OtherLogin.text') }}</ElDivider>
    <ul class="OtherLogin_list">
      <li v-for="item in props.items" :key="item.icon">
        <ElTooltip :auto-close="200" placement="top" :content="item.title">
          <MButton circle>
            <template #icon>
              <Icon :icon="item.icon" @click="item.onClick" />
            </template>
          </MButton>
        </ElTooltip>
      </li>
    </ul>
  </div>
</template>

<style>
.OtherLogin_container {
  @apply w-full flex-col-center gap-xl color-coolGray;
}
.OtherLogin_divider {
  @apply my-0 py-0 select-none;
}
.OtherLogin_divider .el-divider__text {
  @apply text-.8rem;
}
.OtherLogin_list {
  @apply w-[80%] flex justify-evenly flex-wrap gap-1px;
}
</style>
