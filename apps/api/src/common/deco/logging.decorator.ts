import { LoggingService } from '@/common/infra/logging'
/**
 * 控制器中使用会使swagger装饰器失效
 */

/** 修改日志上下文(用于类方法中日志，格式: `类名.方法名`) */
export function LogContextMethod() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const className = target.constructor.name
    const methodContext = `${className}.${propertyKey}`
    // 原来的类方法
    const originalMethod = descriptor.value
    // 重写方法
    descriptor.value = function (...args: any[]) {
      LoggingService.setContext(methodContext)
      return originalMethod.apply(this, args)
    }
    return descriptor
  }
}

/** 类级别的日志上下文装饰器配置选项 */
export interface LogContextClassOptions {
  /** 是否包含私有方法（以下划线开头的方法） */
  includePrivateMethods?: boolean
  /** 要排除的方法名数组 */
  excludeMethods?: string[]
  /** 要包含的方法名数组（如果指定，则只包含这些方法） */
  includeMethods?: string[]
}

/** 类级别的日志上下文装饰器，自动为类中所有方法应用 LogContextMethod */
export function LogContextClass(options?: LogContextClassOptions) {
  return function <T extends { new (...args: any[]): object }>(constructor: T) {
    // 获取类的原型
    const prototype = constructor.prototype
    // 获取类的名称
    const className = constructor.name

    // 获取原型上的所有方法名（不包括构造函数）
    let methodNames = Object.getOwnPropertyNames(prototype).filter((name) => name !== 'constructor' && typeof prototype[name] === 'function')

    // 应用配置选项
    if (options) {
      if (!options.includePrivateMethods) {
        methodNames = methodNames.filter((name) => !name.startsWith('_'))
      }

      if (options.excludeMethods && options.excludeMethods.length > 0) {
        methodNames = methodNames.filter((name) => !options.excludeMethods!.includes(name))
      }

      if (options.includeMethods && options.includeMethods.length > 0) {
        methodNames = methodNames.filter((name) => options.includeMethods!.includes(name))
      }
    }

    // 遍历所有方法并代理重写方法(这里不能用装饰器，否则像controller中的方法将无法被装饰器处理)
    for (const methodName of methodNames) {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName)
      if (descriptor && typeof descriptor.value === 'function') {
        // 创建新的方法上下文
        const methodContext = `${className}.${methodName}`
        const originalMethod = descriptor.value
        // 重写方法
        descriptor.value = function (...args: any[]) {
          LoggingService.setContext(methodContext)
          return originalMethod.apply(this, args)
        }
        // 应用新的描述符
        Object.defineProperty(prototype, methodName, descriptor)
      }
    }

    return constructor
  }
}
