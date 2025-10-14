import type { ILoginBySvgDTO } from '@packages/types'
import type { FormInstance, FormRules } from 'element-plus'
import type { IFormItems } from '@/components'
import { Icon } from '@iconify/vue'
import { authApi } from '@/api'
import { CAPTCHA_LENGTH, PWD_MAX, PWD_MIN, USER_NAME_MAX, USER_NAME_MIN } from '@/constants'
import { t } from '@/i18n'
import { goTo } from '@/router'
import { CaptchaImg, OtherLogin } from '../components'

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
  const formRules = computed<FormRules<ILoginBySvgDTO>>(() => ({
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
  }))
  function setInstance(_formInstance: any) {
    formInstance.value = _formInstance ?? null
  }
  const nameValidateState = computed<boolean>(() => {
    const name = formInstance.value?.fields.find((field) => field.prop === 'name')
    return !name || name.validateState !== 'success'
  })
  const pwdValidateState = computed<boolean>(() => {
    const pwd = formInstance.value?.fields.find((field) => field.prop === 'pwd')
    return !pwd || pwd.validateState !== 'success'
  })
  const formValidateState = computed<boolean>(() => {
    const length = formInstance.value?.fields.length
    return formInstance.value?.fields.filter((item) => item.validateState === 'success').length !== length
  })
  const otherLoginList = [
    {
      icon: 'icon-park-outline:wechat',
      title: t('views.Login.components.OtherLogin.WeChat'),
      onClick: () => ElMessage({ message: '功能开发中...', type: 'warning', duration: 1000 }),
    },
    {
      icon: 'icon-park-outline:tencent-qq',
      title: t('views.Login.components.OtherLogin.QQ'),
      onClick: () => ElMessage({ message: '功能开发中...', type: 'warning', duration: 1000 }),
    },
    {
      icon: 'icon-park-outline:github',
      title: t('views.Login.components.OtherLogin.Github'),
      onClick: () => ElMessage({ message: '功能开发中...', type: 'warning', duration: 1000 }),
    },
    {
      icon: 'icon-park-outline:google',
      title: t('views.Login.components.OtherLogin.Google'),
      onClick: () => ElMessage({ message: '功能开发中...', type: 'warning', duration: 1000 }),
    },
  ]
  async function getCaptchaHandler() {
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
  async function submitHandler() {
    formInstance.value?.validate(async (isValid: boolean) => {
      if (isValid) {
        try {
          const { data } = await authApi.loginBySvg(formData)
          console.warn(data)
          ElMessage({ message: t('views.Login.SvgLogin.success'), type: 'success', duration: 1000 })
          goTo('Home')
        } catch {
          await getCaptchaHandler()
        }
      }
    })
  }
  const formItems = computed<IFormItems[]>(() => [
    {
      type: 'Input',
      key: 'name',
      props: {
        placeholder: t('common.form.username'),
        autocomplete: 'off',
        prefixIcon: h(Icon, {
          icon: 'icon-park-outline:user',
          color: '#bbb',
        }),
      },
    },
    {
      type: 'Input',
      key: 'pwd',
      props: {
        showPassword: true,
        type: 'password',
        placeholder: t('common.form.password'),
        autocomplete: 'off',
        prefixIcon: h(Icon, {
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
        prefixIcon: h(Icon, {
          icon: 'icon-park-outline:unlock-one',
          color: '#bbb',
        }),
      },
      span: 14,
    },
    {
      type: () =>
        h(CaptchaImg, {
          captchaImgUrl: captchaImgUrl.value ?? undefined,
          disabled: nameValidateState.value || pwdValidateState.value,
        }),
      key: 'captchaImg',
      attrs: {
        onClick: async () => {
          if (nameValidateState.value || pwdValidateState.value) {
            ElMessage({ message: t('views.Login.SvgLogin.captchaWarning'), type: 'warning', duration: 1000 })
            return
          }
          await getCaptchaHandler()
        },
      },
      span: 10,
    },
    {
      type: 'Template',
      key: 'LoginProblem',
    },
    {
      type: 'Button',
      key: 'submit',
      props: {
        type: 'primary',
        disabled: formValidateState.value,
      },
      attrs: {
        onClick: async () => await submitHandler(),
      },
      slots: t('common.form.confirm'),
    },
    {
      type: 'Button',
      key: 'EmailLogin',
      attrs: {
        onClick: () => goTo('EmailLogin'),
      },
      props: {
        icon: h(Icon, { icon: 'icon-park-outline:email-block' }),
      },
      slots: t('views.Login.components.OtherLogin.Email'),
      span: 8,
    },
    {
      type: 'Button',
      key: 'QRCode',
      attrs: {
        onClick: () => ElMessage({ message: '功能开发中...', type: 'warning', duration: 1000 }),
      },
      props: {
        icon: h(Icon, { icon: 'icon-park-outline:scan-code' }),
      },
      slots: t('views.Login.components.OtherLogin.QRCode'),
      span: 8,
    },
    {
      type: 'Button',
      key: 'Phone',
      attrs: {
        onClick: () => ElMessage({ message: '功能开发中...', type: 'warning', duration: 1000 }),
      },
      props: {
        icon: h(Icon, { icon: 'icon-park-outline:iphone' }),
      },
      slots: t('views.Login.components.OtherLogin.Phone'),
      span: 8,
    },
    {
      type: () => h(OtherLogin, { items: otherLoginList }),
      key: 'OtherLogin',
    },
  ])
  getCaptchaHandler()
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
