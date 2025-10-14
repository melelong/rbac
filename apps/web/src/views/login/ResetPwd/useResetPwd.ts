import type { IResetPwdByEmailDTO } from '@packages/types'
import type { FormInstance, FormRules } from 'element-plus'
import type { IFormItems } from '@/components'
import { Icon } from '@iconify/vue'
import { authApi } from '@/api'
import { CAPTCHA_LENGTH, PWD_MAX, PWD_MIN } from '@/constants'
import { t } from '@/i18n'
import { goTo } from '@/router'

export function useResetPwd() {
  const formData = reactive<IResetPwdByEmailDTO>({
    email: '',
    pwd: '',
    confirmPwd: '',
    captcha: '',
  })
  const getFormTitle = () => t('views.Login.ResetPwd.title')
  const formInstance = ref<FormInstance | null>(null)
  function setInstance(_formInstance: any) {
    formInstance.value = _formInstance ?? null
  }
  const emailValidateState = computed(() => {
    const email = formInstance.value?.fields.find((field) => field.prop === 'email')
    return !email || email.validateState !== 'success'
  })
  const pwdValidateState = computed(() => {
    const pwd = formInstance.value?.fields.find((field) => field.prop === 'pwd')
    return !pwd || pwd.validateState !== 'success'
  })
  const confirmPwdValidateState = computed(() => {
    const confirmPwd = formInstance.value?.fields.find((field) => field.prop === 'confirmPwd')
    return !confirmPwd || confirmPwd.validateState !== 'success'
  })
  const formValidateState = computed<boolean>(() => {
    const length = formInstance.value?.fields.length
    return formInstance.value?.fields.filter((item) => item.validateState === 'success').length !== length
  })
  async function getCaptchaHandler() {
    try {
      formData.captcha = ''
      const { data } = await authApi.resetPwdByEmailCaptcha({ email: formData.email })
      ElMessage({
        message: data,
        type: 'success',
        duration: 1000,
      })
    } catch (e) {
      console.error(e)
    }
  }
  async function submitHandler() {
    formInstance.value?.validate(async (isValid: boolean) => {
      if (isValid) {
        try {
          const { data } = await authApi.resetPwdByEmail(formData)
          ElMessage({ message: data, type: 'success', duration: 1000 })
          goTo('SvgLogin')
        } catch {
          await getCaptchaHandler()
        }
      }
    })
  }
  const formRules = computed<FormRules<IResetPwdByEmailDTO>>(() => ({
    email: [
      { required: true, message: t('common.form.email'), trigger: ['blur', 'change'] },
      {
        pattern: /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
        message: t('common.form.emailInvalid'),
        trigger: ['blur', 'change'],
      },
    ],
    pwd: [
      { required: true, message: t('common.form.password'), trigger: ['blur', 'change'] },
      { min: PWD_MIN, max: PWD_MAX, message: `${t('common.form.passwordLength')} ${PWD_MIN} ~ ${PWD_MAX}`, trigger: ['blur', 'change'] },
    ],
    confirmPwd: [
      { required: true, message: t('common.form.confirmPwd'), trigger: ['blur', 'change'] },
      {
        validator: (_, value, callback) => {
          callback(value !== formData.pwd ? new Error(t('common.form.passwordNotMatch')) : undefined)
        },
        trigger: ['blur', 'change'],
      },
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
  const formItems = computed<IFormItems[]>(() => [
    {
      type: 'Input',
      key: 'email',
      props: {
        placeholder: t('common.form.email'),
        autocomplete: 'off',
        prefixIcon: h(Icon, {
          icon: 'icon-park-outline:email-lock',
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
      key: 'confirmPwd',
      props: {
        showPassword: true,
        type: 'password',
        placeholder: t('common.form.confirmPwd'),
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
      type: 'Button',
      key: 'captchaEmail',
      props: {
        type: 'primary',
        disabled: emailValidateState.value || pwdValidateState.value || confirmPwdValidateState.value,
      },
      attrs: {
        onClick: async () => await getCaptchaHandler(),
      },
      slots: t('common.form.send'),
      span: 10,
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
      key: 'Back',
      attrs: {
        onClick: () => goTo('back'),
      },
      slots: t('common.form.back'),
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
