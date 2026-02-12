import { Global, Module } from '@nestjs/common'
import { ClsModule } from 'nestjs-cls'

/** 上下文模块 */
@Global()
@Module({
  imports: [ClsModule.forRoot({ global: true })],
  exports: [ClsModule],
})
export class CtxModule {}
