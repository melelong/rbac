import type { IEmailConfig } from '@/config'
import { MailerModule } from '@nestjs-modules/mailer'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EMAIL_CONFIG_KEY } from '@/config'
import { EmailProcessor } from './email.processor'
import { EmailService } from './email.service'

/** 邮件模块 */
@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<IEmailConfig>(EMAIL_CONFIG_KEY)!
        return config
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService, EmailProcessor],
})
export class EmailModule {}
