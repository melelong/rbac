import type { Request as ExpressRequest } from 'express'

export function getClientIp(req: ExpressRequest) {
  const forwardedFor = req.header('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return req.ips.length ? req.ips[0] : req.ip || req.socket.remoteAddress || '未知IP'
}
