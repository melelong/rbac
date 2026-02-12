<script lang="ts" setup>
import type { ButtonProps, MessageProps } from 'element-plus'
import { Icon } from '@iconify/vue'
import { createAuth } from '@/api/auth'
import { MModeBtn } from '@/components'
import { goTo } from '@/router'

const types: ButtonProps['type'][] = ['default', 'text', 'primary', 'success', 'warning', 'danger', 'info']
const map: { [key: string]: MessageProps['type'] } = {
  default: 'primary',
  text: 'primary',
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'error',
  info: 'info',
}
function handleClick(type: ButtonProps['type']) {
  ElMessage({
    message: type,
    type: map[type],
  })
}
async function testPlugin() {
  const res = await createAuth({ name: 'admin', remark: '测试插件' })
  console.warn(res)
}
const iconRef = ref('icon-park-outline:components')
setTimeout(() => {
  iconRef.value = 'mdi:account-cash-outline'
}, 10000)
</script>

<template>
  <div class="mb-4 wh-screen flex-col-center bg-white dark:bg-black">
    <div class="mb-4 flex">
      <Icon :icon="iconRef"></Icon>
    </div>
    <div class="mb-4 flex">
      <MModeBtn></MModeBtn>
      <MButton @click="testPlugin">testPlugin</MButton>
      <MButton @click="goTo('Login')">Login</MButton>
      <MButton @click="goTo('Workspace')">Workspace</MButton>
    </div>
    <div class="mb-4">
      <KeepAlive :include="['MVideo']" :max="1">
        <MVideo></MVideo>
      </KeepAlive>
    </div>
    <div class="mb-4">
      <ElButton v-for="(type, index) in types" :key="index" :type="type" @click="handleClick(type!)">{{ type }}</ElButton>
    </div>
    <div class="mb-4">
      <ElButton v-for="(type, index) in types" :key="index" disabled :type="type" @click="handleClick(type!)">{{ type }}</ElButton>
    </div>
    <div class="mb-4">
      <MButton v-for="(type, index) in types" :key="index" :type="type" @click="handleClick(type!)">{{ type }}</MButton>
    </div>
    <div class="mb-4">
      <MButton v-for="(type, index) in types" :key="index" disabled :type="type" @click="handleClick(type!)">{{ type }}</MButton>
    </div>
  </div>
</template>
