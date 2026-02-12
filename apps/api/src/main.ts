import { BootImpl, BootModule } from '@/boot'

BootImpl.create(BootModule)
  .then(async (boot) => {
    await boot.init()
    boot.enableHotReload()
    await boot.listen()
  })
  .catch((err) => console.error('服务启动失败', err))
