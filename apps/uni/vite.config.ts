import type { ClientRequest, IncomingMessage, ServerResponse } from 'node:http'
import type { HttpProxy, ProxyOptions } from 'vite'
import Uni from '@uni-helper/plugin-uni'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    host: '0.0.0.0',
    hmr: true,
    port: 4003,
    warmup: {
      clientFiles: ['./index.html'],
    },
    proxy: {
      '/api': {
        target: 'http://192.168.0.105:4001/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure(proxy: HttpProxy.Server, _options: ProxyOptions) {
          proxy.on('proxyReq', (proxyReq: ClientRequest, req: IncomingMessage, _res: ServerResponse, _options: HttpProxy.ServerOptions) => {
            let clientIp: string
            const forwardedFor = req.headers['x-forwarded-for']
            clientIp = req.socket.remoteAddress || '未知IP'
            if (forwardedFor) clientIp = clientIp = forwardedFor?.length ? forwardedFor[0] : (forwardedFor as string).split(',')[0].trim()
            proxyReq.setHeader('x-forwarded-for', clientIp)
          })
        },
      },
    },
  },
  plugins: [Uni()],
})
