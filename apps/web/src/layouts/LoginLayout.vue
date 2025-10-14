<script lang="ts" setup>
import bannerUrl from '@/assets/preImages/login_banner.webp'
import { MI18nBtn, MModeBtn, MThemeBtn } from '@/components'
import { t } from '@/i18n'
import { LOGIN_KEEP_ALIVE } from '@/router/modules/Login'

defineOptions({ name: 'LoginLayout' })
const isLoading = ref(true)
onMounted(() => setTimeout(() => (isLoading.value = false), 500))
</script>

<template>
  <div
    v-mLoading="isLoading"
    class="LoginLayout_container wh-full flex-center overflow-hidden bg-[url(@/assets/preImages/bg.png)] dark:from-primary-950 dark:to-slate-950 dark:bg-gradient-to-b"
  >
    <div
      class="relative min-h-auto w-[20rem] flex overflow-hidden rounded-[2rem] bg-white px-1rem py-2rem shadow-lg shadow-slate-500/40 2xl:w-[35rem] lg:w-[35rem] md:w-[35rem] sm:w-[20rem] xl:w-[35rem] dark:bg-slate-950 dark:shadow-primary/40"
    >
      <div class="left hidden min-w-[50%] flex-1 items-center justify-center px-[1rem] md:flex">
        <ElImage fill="contain" :src="bannerUrl" :alt="t('layouts.LoginLayout.banner')" />
      </div>
      <div class="right flex-1">
        <div class="flex justify-end pb-2">
          <div class="flex rounded-[.5rem] bg-white shadow-lg shadow-slate-500/40 dark:bg-slate-950 dark:shadow-primary/40">
            <MThemeBtn />
            <MI18nBtn />
            <MModeBtn />
          </div>
        </div>
        <div class="right_content overflow-hidden">
          <RouterView v-slot="{ Component }">
            <Transition name="slide-down" mode="out-in">
              <KeepAlive :include="LOGIN_KEEP_ALIVE" :max="LOGIN_KEEP_ALIVE.length">
                <Component :is="Component" />
              </KeepAlive>
            </Transition>
          </RouterView>
        </div>
      </div>
    </div>
  </div>
</template>
