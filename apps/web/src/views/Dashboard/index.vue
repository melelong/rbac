<script lang="ts" setup>
import { authApi } from '@/api'
import { goTo } from '@/router'

defineOptions({ name: 'Dashboard' })
async function logout() {
  await authApi.logout()
  goTo('Login')
}
</script>

<template>
  <div class="color-amber">
    <ElButton @click="logout()">登出</ElButton>
  </div>
</template>
