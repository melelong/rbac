import type { Request, Response } from 'express'
import type { ILoggingCls } from '@/common/infra/logging'
import { Injectable, Logger } from '@nestjs/common'
import dayjs from 'dayjs'
import { ClsMiddleware, ClsService } from 'nestjs-cls'
import { REQ_CTX } from '@/common/infra/ctx'
import { getClientIp, uuid_v4 } from '@/common/utils'
/** 请求上下文中间件 */
@Injectable()
export class CtxMiddleware extends ClsMiddleware {
  constructor() {
    super({
      generateId: true,
      idGenerator: (request) => ((request as Request).headers['X-Trace-Id'] as string) ?? uuid_v4(),
      setup(cls: ClsService<ILoggingCls>, req: Request, res: Response) {
        const logger = new Logger(CtxMiddleware.name)
        logger.log(CtxMiddleware.name)
        const traceID = cls.getId()
        const now = dayjs().valueOf()
        // 请求信息注入请求上下文
        cls.set(REQ_CTX.CLIENT_IP, getClientIp(req))
        cls.set(REQ_CTX.METHOD, req.method)
        cls.set(REQ_CTX.START_TIMESTAMP, now)
        cls.set(REQ_CTX.ORIGIN_URL, req.originalUrl)
        cls.set(REQ_CTX.REFERER, req.headers.referer || '直接访问')
        cls.set(REQ_CTX.USER_AGENT, req.headers['user-agent'] || '未知设备')
        const headers = new Map([
          /** 链路ID */
          ['X-Trace-Id', traceID],
          /** 系统引擎 */
          ['X-Powered-By', 'rbac'],
          ['X-Start-Timestamp', String(now)],
        ])
        res.setHeaders(headers)
      },
    })
  }
}
