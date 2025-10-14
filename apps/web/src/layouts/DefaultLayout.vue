<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { PageLayout } from '@/layouts'

defineOptions({ name: 'DefaultLayout' })
</script>

<template>
  <ElContainer class="DefaultLayout_container wh-screen">
    <ElAside class="bg-white shadow-lg shadow-slate-500/40 dark:bg-slate-950 dark:shadow-primary/40" width="200px">
      <ElScrollbar>
        <ElMenu :default-openeds="['1', '3']">
          <ElSubMenu index="1">
            <template #title> <Icon icon="mdi:account-cash-outline"></Icon>Navigator One </template>
            <ElMenuItemGroup>
              <template #title>Group 1</template>
              <ElMenuItem index="1-1">Option 1</ElMenuItem>
              <ElMenuItem index="1-2">Option 2</ElMenuItem>
            </ElMenuItemGroup>
            <ElMenuItemGroup title="Group 2">
              <ElMenuItem index="1-3">Option 3</ElMenuItem>
            </ElMenuItemGroup>
            <ElSubMenu index="1-4">
              <template #title>Option4</template>
              <ElMenuItem index="1-4-1">Option 4-1</ElMenuItem>
            </ElSubMenu>
          </ElSubMenu>
          <ElSubMenu index="2">
            <template #title> <Icon icon="mdi:account-cash-outline"></Icon>Navigator Two </template>
            <ElMenuItemGroup>
              <template #title>Group 1</template>
              <ElMenuItem index="2-1">Option 1</ElMenuItem>
              <ElMenuItem index="2-2">Option 2</ElMenuItem>
            </ElMenuItemGroup>
            <ElMenuItemGroup title="Group 2">
              <ElMenuItem index="2-3">Option 3</ElMenuItem>
            </ElMenuItemGroup>
            <ElSubMenu index="2-4">
              <template #title>Option 4</template>
              <ElMenuItem index="2-4-1">Option 4-1</ElMenuItem>
            </ElSubMenu>
          </ElSubMenu>
          <ElSubMenu index="3">
            <template #title> <Icon icon="mdi:account-cash-outline"></Icon>Navigator Three </template>
            <ElMenuItemGroup>
              <template #title>Group 1</template>
              <ElMenuItem index="3-1">Option 1</ElMenuItem>
              <ElMenuItem index="3-2">Option 2</ElMenuItem>
            </ElMenuItemGroup>
            <ElMenuItemGroup title="Group 2">
              <ElMenuItem index="3-3">Option 3</ElMenuItem>
            </ElMenuItemGroup>
            <ElSubMenu index="3-4">
              <template #title>Option 4</template>
              <ElMenuItem index="3-4-1">Option 4-1</ElMenuItem>
            </ElSubMenu>
          </ElSubMenu>
        </ElMenu>
      </ElScrollbar>
    </ElAside>
    <ElContainer>
      <ElHeader class="bg-white dark:bg-black"><MModeBtn></MModeBtn></ElHeader>
      <ElMain class="bg-red-2 dark:bg-slate-900">
        <PageLayout>
          <RouterView v-slot="{ Component }">
            <Transition name="slide-right" mode="out-in">
              <!-- <KeepAlive :include="LOGIN_KEEP_ALIVE" :max="LOGIN_KEEP_ALIVE.length"> -->
              <Component :is="Component" />
              <!-- </KeepAlive> -->
            </Transition>
          </RouterView>
        </PageLayout>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>
