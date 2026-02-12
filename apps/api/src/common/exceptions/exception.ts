import { HttpException } from '@nestjs/common'

/** ORM异常 */
export class OrmException<T extends string> extends HttpException {
  constructor(code: T, textMap: Record<T, [string, number]>) {
    super(
      {
        code,
        message: textMap[code][0],
      },
      textMap[code][1],
    )
  }
}

/** 业务异常 */
export class BusinessException<T extends string> extends HttpException {
  constructor(code: T, textMap: Record<T, [string, number]>) {
    super(
      {
        code,
        message: textMap[code][0],
      },
      textMap[code][1],
    )
  }
}

/** 缓存异常 */
export class CacheException<T extends string> extends HttpException {
  constructor(code: T, textMap: Record<T, [string, number]>) {
    super(
      {
        code,
        message: textMap[code][0],
      },
      textMap[code][1],
    )
  }
}

/** 节流器异常 */
export class ThrottlerException<T extends string> extends HttpException {
  constructor(code: T, textMap: Record<T, [string, number]>) {
    super(
      {
        code,
        message: textMap[code][0],
      },
      textMap[code][1],
    )
  }
}

/** 队列异常 */
export class QueueException<T extends string> extends HttpException {
  constructor(code: T, textMap: Record<T, [string, number]>) {
    super(
      {
        code,
        message: textMap[code][0],
      },
      textMap[code][1],
    )
  }
}
