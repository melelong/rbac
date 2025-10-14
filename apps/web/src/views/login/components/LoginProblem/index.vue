<script lang="ts" setup>
import { t } from '@/i18n'
import { goTo } from '@/router'

defineOptions({ name: 'LoginProblem' })
</script>

<template>
  <div class="w-full flex justify-between">
    <div class="flex select-none">
      <span> {{ t('views.Login.SvgLogin.noAccount') }}</span>
      <ElButton type="primary" link @click="goTo('EmailRegister')">{{ t('views.Login.SvgLogin.register') }}</ElButton>
    </div>
    <div>
      <ElButton type="primary" link @click="goTo('ResetPwd')">{{ t('views.Login.SvgLogin.forgetPwd') }}</ElButton>
    </div>
  </div>
</template>
