<script lang="ts" setup>
defineOptions({ name: 'PageLayout' })
</script>

<template>
  <div
    class="PageLayout_container scrollbar-none h-full max-h-full overflow-auto rounded-[8px] bg-white shadow-lg shadow-slate-500/40 dark:bg-slate-950 dark:shadow-primary/40"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}

.scrollbar-none {
  -ms-overflow-style: none; /* IE 和 Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
