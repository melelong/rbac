<script lang="ts" setup>
import { AsyncMForm } from '@/components'
import { LoginProblem } from '../components'
import { useEmailLogin } from './useEmailLogin'

defineOptions({ name: 'EmailLogin' })
const { setInstance, formItems, formRules, formData, getFormTitle } = useEmailLogin()
</script>

<template>
  <AsyncMForm :ref="setInstance" validate-on-rule-change :form-title="getFormTitle()" :form-items="formItems" :rules="formRules" :model="formData">
    <template #LoginProblem>
      <LoginProblem />
    </template>
  </AsyncMForm>
</template>
