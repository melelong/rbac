export interface ISendEmailOptions<T = any> {
  /** 发送者名称 */
  fromName?: string
  /** 接收者邮箱 */
  to: string
  /** 邮件主题 */
  subject: string
  /** 邮件模板 */
  template: string
  /** 模板上下文 */
  context: T
}

/** 邮件服务接口 */
export interface IEmailService {
  /**
   * 发送邮件
   * @param options 发送邮件参数
   */
  sendEmail: <T = any>(options: ISendEmailOptions<T>) => Promise<boolean>
}
