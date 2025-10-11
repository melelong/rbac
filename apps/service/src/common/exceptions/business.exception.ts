import { HttpException } from '@nestjs/common'

/** 业务错误类型 */
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
