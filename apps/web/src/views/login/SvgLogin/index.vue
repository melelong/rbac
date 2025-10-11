<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { AsyncMForm } from '@/components'
import { t } from '@/i18n'
import { goTo } from '@/router'
import { useSvgLogin } from './useSvgLogin'

defineOptions({ name: 'SvgLogin' })
const { formData, formRules, setInstance, formItems, getFormTitle } = useSvgLogin()
</script>

<template>
  <AsyncMForm :ref="setInstance" validate-on-rule-change :form-title="getFormTitle()" :form-items="formItems" :rules="formRules" :model="formData">
    <template #register>
      <div class="w-full flex justify-between">
        <div>
          <ElText>{{ t('views.Login.SvgLogin.noAccount') }}</ElText>
          <ElButton type="primary" link @click="goTo('EmailRegister')">{{ t('views.Login.SvgLogin.register') }}</ElButton>
        </div>
        <div>
          <ElButton type="primary" link @click="goTo('ResetPwd')">{{ t('views.Login.SvgLogin.forgetPwd') }}</ElButton>
        </div>
      </div>
    </template>
  </AsyncMForm>
</template>
