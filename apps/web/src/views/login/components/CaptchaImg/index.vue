<script lang="ts" setup>
import type { ICaptchaImgProps } from './ICaptchaImg'
import { t } from '@/i18n'

defineOptions({ name: 'CaptchaImg' })
const props = defineProps<ICaptchaImgProps>()
</script>

<template>
  <MButton class="CaptchaImg_container" :disabled="props.disabled">
    <template v-if="props.captchaImgUrl">
      <div class="CaptchaImg_img_container">
        <img :src="props.captchaImgUrl" :alt="t('views.Login.components.CaptchaImg.alt')" />
      </div>
    </template>
    <template v-else> {{ props.text ?? t('views.Login.components.CaptchaImg.text') }} </template>
  </MButton>
</template>

<style>
.CaptchaImg_container {
  @apply max-h-[32px] flex-center cursor-pointer select-none overflow-hidden border rounded-[4px] p-0;
}
.CaptchaImg_img_container.CaptchaImg_disabled {
  @apply cursor-not-allowed relative;
}
.CaptchaImg_img_container > img {
  @apply block h-full w-full object-cover;
}
</style>
