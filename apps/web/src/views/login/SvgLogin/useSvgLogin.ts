/* eslint-disable style/quote-props */
import type { ILoginBySvgDTO } from '@packages/types'
import type { FormInstance, FormRules } from 'element-plus'
import type { IFormItems } from '@/components'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { authApi } from '@/api'
import { CAPTCHA_LENGTH, PWD_MAX, PWD_MIN, USER_NAME_MAX, USER_NAME_MIN } from '@/constants'
import { t } from '@/i18n'
import { goTo } from '@/router'
import { CaptchaImg } from '../components'

export function useSvgLogin() {
  const formData = reactive<ILoginBySvgDTO>({
    name: '',
    pwd: '',
    captcha: '',
    token: '',
  })
  const getFormTitle = () => t('views.Login.SvgLogin.title')
  const formInstance = ref<FormInstance | null>(null)
  const captchaImgUrl = ref<null | string>(null)
  const { locale } = useI18n()
  const formRules = computed<FormRules<ILoginBySvgDTO>>(() => {
    // eslint-disable-next-line ts/no-unused-expressions
    locale
    return {
      name: [
        { required: true, message: t('common.form.username'), trigger: ['blur', 'change'] },
        {
          min: USER_NAME_MIN,
          max: USER_NAME_MAX,
          message: `${t('common.form.usernameLength')} ${USER_NAME_MIN} ~ ${USER_NAME_MAX}`,
          trigger: ['blur', 'change'],
        },
      ],
      pwd: [
        { required: true, message: t('common.form.password'), trigger: ['blur', 'change'] },
        { min: PWD_MIN, max: PWD_MAX, message: `${t('common.form.passwordLength')} ${PWD_MIN} ~ ${PWD_MAX}`, trigger: ['blur', 'change'] },
      ],
      captcha: [
        { required: true, message: t('common.form.captcha'), trigger: ['blur', 'change'] },
        {
          min: CAPTCHA_LENGTH,
          max: CAPTCHA_LENGTH,
          message: `${t('common.form.captchaLength')} ${CAPTCHA_LENGTH}`,
          trigger: ['blur', 'change'],
        },
      ],
    }
  })
  function setInstance(_formInstance: any) {
    formInstance.value = _formInstance ?? null
  }
  async function getSvg() {
    try {
      formData.captcha = ''
      const { data } = await authApi.loginBySvgCaptcha()
      if (data) {
        formData.token = data?.token
        captchaImgUrl.value = data?.svg
      }
    } catch (e) {
      console.error(e)
    }
  }
  getSvg()
  const submitDisabled = computed<boolean>(() => {
    const length = formInstance.value?.fields.length
    return formInstance.value?.fields.filter((item) => item.validateState === 'success').length !== length
  })
  const formItems = computed<IFormItems[]>(() => [
    {
      type: 'Input',
      key: 'name',
      props: {
        placeholder: t('common.form.username'),
        autocomplete: 'off',
        'prefix-icon': h(Icon, {
          icon: 'icon-park-outline:user',
          color: '#bbb',
        }),
      },
    },
    {
      type: 'Input',
      key: 'pwd',
      props: {
        'show-password': true,
        type: 'password',
        placeholder: t('common.form.password'),
        autocomplete: 'off',
        'prefix-icon': h(Icon, {
          icon: 'icon-park-outline:key',
          color: '#bbb',
        }),
      },
    },
    {
      type: 'Input',
      key: 'captcha',
      props: {
        placeholder: t('common.form.captcha'),
        autocomplete: 'off',
        'prefix-icon': h(Icon, {
          icon: 'icon-park-outline:unlock-one',
          color: '#bbb',
        }),
      },
      span: 14,
    },
    {
      type: () => h(CaptchaImg, { captchaImgUrl: captchaImgUrl.value ?? undefined }),
      key: 'captchaImg',
      attrs: {
        onClick: async () => {
          await getSvg()
        },
      },
      span: 10,
    },
    {
      type: 'Template',
      key: 'register',
    },
    {
      type: 'Button',
      key: 'submit',
      props: {
        type: 'primary',
        disabled: submitDisabled.value,
      },
      attrs: {
        onClick: () => {
          formInstance.value?.validate(async (isValid: boolean) => {
            if (isValid) {
              await authApi.loginBySvg(formData)

              // try {
              //   await authApi.loginBySvg(formData)
              //   // goTo('Home')
              // } catch {
              //   // await getSvg()
              // }
            }
          })
        },
      },
      slots: t('common.form.confirm'),
    },
    {
      type: 'Button',
      key: 'EmailLogin',
      attrs: {
        onClick: () => goTo('EmailLogin'),
      },
      slots: t('views.Login.EmailLogin.title'),
    },
  ])
  return {
    /** 表单数据 */
    formData,
    /** 表单实例 */
    formInstance,
    /** 表单规则 */
    formRules,
    /** 表单实例获取  */
    setInstance,
    /** 表单项 */
    formItems,
    /** 获取表单标题 */
    getFormTitle,
  }
}
