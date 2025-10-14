import type { FormInstance, FormRules } from 'element-plus'
import type { IFormItems } from '@/components'
import { useI18n } from 'vue-i18n'

export interface IUseFormOptions<T extends object = object> {
  /** 表单数据 */
  formData: T
  /** 表单项 */
  formItems: IFormItems[]
  /** 表单项是否依赖i18n */
  formItemsI18n?: boolean
  /** 表单规则 */
  formRules: FormRules<T>
  /** 表单规则是否依赖i18n */
  formRulesI18n?: boolean
}
export function useMForm<T extends object = object>(options: IUseFormOptions<T>) {
  const { formData, formItems, formRules, formItemsI18n = false, formRulesI18n = false } = options
  const { locale } = useI18n()
  const formDataProxy = reactive<T>(formData)

  // 表单实例
  const formInstanceProxy = ref<FormInstance | null>(null)
  function setFormInstance(formInstance: any) {
    formInstanceProxy.value = formInstance ?? null
  }
  // 表单项
  const formItemsProxy = computed<IFormItems[]>(() => {
    // 可能会依赖i18n，所以这里要收集一下依赖，重新计算
    // eslint-disable-next-line ts/no-unused-expressions
    if (formItemsI18n) locale.value

    return formItems
  })
  // 表单规则
  const formRulesProxy = computed<FormRules<T>>(() => {
    // 可能会依赖i18n，所以这里要收集一下依赖，重新计算
    // eslint-disable-next-line ts/no-unused-expressions
    if (formRulesI18n) locale.value
    return formRules
  })

  const submitStateProxy = computed<boolean>(() => {
    const length = formInstanceProxy.value?.fields.length
    return formInstanceProxy.value?.fields.filter((item) => item.validateState === 'success').length !== length
  })

  return {
    /** 表单数据代理 */
    formDataProxy,
    /** 表单实例代理 */
    formInstanceProxy,
    /** 表单实例获取  */
    setFormInstance,
    /** 表单项代理 */
    formItemsProxy,
    /** 表单规则代理 */
    formRulesProxy,
    /** 表单提交代理(是否表单验证全部通过) */
    submitStateProxy,
  }
}
