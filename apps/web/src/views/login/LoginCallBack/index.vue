<script lang="ts" setup>
import { goTo } from '@/router'

defineOptions({ name: 'LoginCallBack' })
</script>

<template>
  <div>
    <h1>LoginCallBack</h1>
    <MButton @click="goTo('Login')">登录页</MButton>
  </div>
</template>
