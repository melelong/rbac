/* eslint-disable style/quote-props */
import type { IRegisterByEmailDTO } from '@packages/types'
import type { FormInstance, FormRules } from 'element-plus'
import type { IFormItems } from '@/components'
import { Icon } from '@iconify/vue'
import { CAPTCHA, CAPTCHA_LENGTH, EMAIL, PWD, PWD_MAX, PWD_MIN, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '@/constants'
import { t } from '@/i18n'
import { goTo } from '@/router'

export function useResetPwd() {
  const formData = reactive<IRegisterByEmailDTO>({
    name: '',
    pwd: '',
    captcha: '',
    email: '',
  })
  const getFormTitle = () => t('重置密码')
  const formInstance = ref<FormInstance | null>(null)
  const formRules = reactive<FormRules<IRegisterByEmailDTO>>({
    name: [
      { required: true, message: `${t('请输入')}${USER_NAME}`, trigger: ['blur', 'change'] },
      {
        min: USER_NAME_MIN,
        max: USER_NAME_MAX,
        message: `${USER_NAME}${t('长度')} ${USER_NAME_MIN} ~ ${USER_NAME_MAX}`,
        trigger: ['blur', 'change'],
      },
    ],
    pwd: [
      { required: true, message: `${t('请输入')}${PWD}`, trigger: ['blur', 'change'] },
      { min: PWD_MIN, max: PWD_MAX, message: `${PWD}${t('长度')} ${PWD_MIN} ~ ${PWD_MAX}`, trigger: ['blur', 'change'] },
    ],
    captcha: [
      { required: true, message: `${t('请输入')}${CAPTCHA}`, trigger: ['blur', 'change'] },
      { min: CAPTCHA_LENGTH, max: CAPTCHA_LENGTH, message: `${CAPTCHA}${t('长度')} ${CAPTCHA_LENGTH}`, trigger: ['blur', 'change'] },
    ],
    email: [{ required: true, message: `${t('请输入')}${EMAIL}`, trigger: ['blur', 'change'] }],
  })
  function setInstance(_formInstance: any) {
    formInstance.value = _formInstance ?? null
  }
  const submitDisabled = computed<boolean>(() => {
    const length = formInstance.value?.fields.length
    return formInstance.value?.fields.filter((item) => item.validateState === 'success').length !== length
  })
  const formItems = computed<IFormItems[]>(() => [
    {
      type: 'Input',
      key: 'username',
      props: {
        placeholder: t('请输入用户名'),
        autocomplete: 'off',
        'prefix-icon': h(Icon, {
          icon: 'icon-park-outline:user',
        }),
      },
    },
    {
      type: 'Input',
      key: 'password',
      props: {
        'show-password': true,
        type: 'password',
        placeholder: t('请输入密码'),
        autocomplete: 'off',
        'prefix-icon': h(Icon, {
          icon: 'icon-park-outline:key',
        }),
      },
    },
    {
      type: 'Input',
      key: 'email',
      props: {
        placeholder: t('请输入邮箱'),
        autocomplete: 'off',
        'prefix-icon': h(Icon, {
          icon: 'icon-park-outline:email-lock',
        }),
      },
    },
    {
      type: 'Input',
      key: 'captcha',
      props: {
        placeholder: t('请输入验证码'),
        autocomplete: 'off',
        'prefix-icon': h(Icon, {
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
        disabled: formData.email === '',
      },
      slots: t('发送'),
      span: 10,
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
            console.warn(isValid)
          })
        },
      },
      slots: t('确认'),
    },
    {
      type: 'Button',
      key: 'back',
      attrs: {
        onClick: () => goTo('SvgLogin'),
      },
      slots: t('返回'),
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
