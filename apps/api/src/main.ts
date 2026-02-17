import { BootImpl, BootModule } from '@/boot'
/** 将mongodb日志传输器添加到winston */
import 'winston-mongodb'

BootImpl.create(BootModule)
  .then(async (boot) => {
    await boot.init()
    boot.enableHotReload()
    await boot.listen()
  })
  .catch((err) => console.error('服务启动失败', err))
