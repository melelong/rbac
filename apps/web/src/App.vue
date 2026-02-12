<script lang="ts" setup>
import { Fragment } from 'vue'

defineOptions({ name: 'App' })
const isLoading = ref(true)
</script>

<template>
  <Fragment>
    <div class="a">1</div>
  </Fragment>
  <div v-mLoading="isLoading" class="App_container wh-screen bg-[#cccccc] dark:bg-[#212121]">
    <RouterView v-slot="{ Component }">
      <Component :is="Component" @vue:mounted="() => (isLoading = false)" />
    </RouterView>
  </div>
</template>
