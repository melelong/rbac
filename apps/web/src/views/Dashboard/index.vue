<script lang="ts" setup>
import { goTo } from '@/router'
import { useAuth } from '@/store/modules/auth'

defineOptions({ name: 'Dashboard' })
const { logOut, getMeInfo } = useAuth()
</script>

<template>
  <div class="Workspace_container max-h-full flex-center py-10">
    <MButton @click="goTo('ColorPalette')">ColorPalette</MButton>
    <MButton @click="goTo('Test')">Test</MButton>
    <MButton @click="getMeInfo()">MeInfo</MButton>
    <MButton @click="goTo('Login')">Login</MButton>
    <MButton @click="logOut({})">Logout</MButton>
  </div>
</template>
