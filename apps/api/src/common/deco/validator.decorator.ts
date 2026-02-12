import type { ValidationArguments, ValidationOptions } from 'class-validator'
import { applyDecorators } from '@nestjs/common'
import { Length as InputStringLength, IsArray, IsEmail, IsJWT, IsNotEmpty, Matches, registerDecorator } from 'class-validator'
/**
 * 验证输入字符串长度(与class-validator命名一样是为了swagger cli插件AST识别)
 * @param min 最小长度(别用变量,swagger识别不了)
 * @param max 最大长度(别用变量,swagger识别不了)
 * @param name key名
 * @param isArray 是否是数组
 */
export function Length(min: number, max: number, name: string, isArray: boolean = false) {
  const decorators = [
    InputStringLength(min, max, {
      message: `${name}${min === max ? `长度为${min}位` : `在 ${min} ~ ${max} 位之间`}`,
      each: isArray,
    }),
  ]
  return applyDecorators.apply(this, decorators)
}

/**
 * 不能为空
 * @param name key名
 * @param isArray 是否是数组
 */
export function NotEmpty(name: string, isArray: boolean = false) {
  return applyDecorators.apply(this, [
    IsNotEmpty({
      message: `${name}不能为空`,
      each: isArray,
    }),
  ])
}

/**
 * 验证邮箱
 * @param isArray 是否是数组
 */
export function InputEmail(isArray: boolean = false) {
  return applyDecorators.apply(this, [
    IsEmail(
      {},
      {
        message: '邮箱格式不合法',
        each: isArray,
      },
    ),
  ])
}

/**
 * 验证密码
 * @param isArray 是否是数组
 */
export function InputPwd(isArray: boolean = false) {
  return applyDecorators.apply(this, [
    Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
      message: '密码需含大小写字母、数字，且至少8位',
      each: isArray,
    }),
  ])
}

/**
 * 验证编码
 * @param name key名
 * @param isArray 是否是数组
 */
export function InputCode(name: string = '编码', isArray: boolean = false) {
  return applyDecorators.apply(this, [
    Matches(/^(?=.*[A-Z])[A-Z\d_]+$/, {
      message: `${name}需由大写字母、数字、_组成，至少含1位大写字母`,
      each: isArray,
    }),
  ])
}

/**
 * 验证两边空格
 * @param name key名
 * @param isArray 是否是数组
 */
export function InputTrim(name: string, isArray: boolean = false) {
  return applyDecorators.apply(this, [
    Matches(/^\S(.*\S)?$/, {
      message: `${name}首尾不能包含空格`,
      each: isArray,
    }),
  ])
}

/**
 * 验证空格
 * @param name key名
 * @param isArray 是否是数组
 */
export function InputSpace(name: string, isArray: boolean = false) {
  return applyDecorators.apply(this, [
    Matches(/^\S*$/, {
      message: `${name}不能包含空格`,
      each: isArray,
    }),
  ])
}

/**
 * 验证数组
 * @param name key名
 * @param isArray 是否是数组
 */
export function InputArray(name: string, isArray: boolean = false) {
  return applyDecorators.apply(this, [
    IsArray({
      message: `${name}列表必须是数组`,
      each: isArray,
    }),
  ])
}

/**
 * 验证JWT
 * @param name key名
 * @param isArray 是否是数组
 */
export function InputJWT(name: string, isArray: boolean = false) {
  return applyDecorators.apply(this, [
    IsJWT({
      message: `${name}是不合法的JWT格式`,
      each: isArray,
    }),
  ])
}

/**
 * 对比验证
 * @param compareArray 对比的键名,当前属性值与数组中所有属性值一致才验证通过
 * @param options 参数
 */
export function InputCompare(compareArray: Array<string>, options?: ValidationOptions) {
  return function (obj: any, propertyName: string) {
    registerDecorator({
      target: obj.constructor,
      propertyName,
      options,
      validator: {
        validate(_value: any, args: ValidationArguments) {
          if (compareArray.length === 0) throw new Error(`compareArray不能为空数组`)
          const _obj = args.object
          const currentValue = _obj[propertyName]
          return compareArray.every((key) => Object.is(currentValue, _obj[key]))
        },
        defaultMessage(..._args: any[]) {
          return `${compareArray.length > 1 ? compareArray.join(',') : compareArray[0]},${propertyName}不一致`
        },
      },
    })
  }
}
