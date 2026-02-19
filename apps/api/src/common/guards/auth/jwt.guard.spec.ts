import type { ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'

import { IS_PUBLIC_KEY } from '@/common/deco'
import { JwtGuard } from '@/common/guards/auth/jwt.guard'
import { LoggingService } from '@/common/infra/logging'

jest.mock('@/common/deco', () => ({
  IS_PUBLIC_KEY: Symbol('IS_PUBLIC_KEY'),
  LogContextClass: () => (constructor: any) => constructor,
}))

jest.mock('@/common/infra/logging', () => ({
  LoggingService: jest.fn().mockImplementation(() => ({
    debug: jest.fn(),
  })),
}))

describe('jwtGuard', () => {
  let guard: JwtGuard
  let _reflector: Reflector
  let loggingService: LoggingService

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  }

  const mockLoggingService = {
    debug: jest.fn(),
  }

  const mockExecutionContext = (overrides: Partial<ExecutionContext> = {}): ExecutionContext => {
    const mockRequest: Partial<Request> = {
      headers: {},
      cookies: {},
    }
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => mockRequest,
        getResponse: () => ({}),
      }),
      getHandler: jest.fn().mockReturnValue({}),
      getClass: jest.fn().mockReturnValue({}),
      ...overrides,
    } as ExecutionContext
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtGuard, { provide: Reflector, useValue: mockReflector }, { provide: LoggingService, useValue: mockLoggingService }],
    }).compile()

    guard = module.get<JwtGuard>(JwtGuard)
    _reflector = module.get<Reflector>(Reflector)
    loggingService = module.get<LoggingService>(LoggingService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('canActivate', () => {
    it('公共接口应该直接放行', async () => {
      const context = mockExecutionContext()
      mockReflector.getAllAndOverride.mockReturnValue(true)

      const result = await guard.canActivate(context)

      expect(result).toBe(true)
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
      expect(loggingService.debug).toHaveBeenCalledWith('是公共接口')
    })

    it('非公共接口应该调用父类 canActivate', async () => {
      const context = mockExecutionContext()
      mockReflector.getAllAndOverride.mockReturnValue(false)

      const superCanActivateSpy = jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate').mockResolvedValue(true)

      const result = await guard.canActivate(context)

      expect(result).toBe(true)
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
      expect(loggingService.debug).toHaveBeenCalledWith('不是公共接口')
      expect(superCanActivateSpy).toHaveBeenCalled()

      superCanActivateSpy.mockRestore()
    })

    it('非公共接口且JWT验证失败应该拒绝访问', async () => {
      const context = mockExecutionContext()
      mockReflector.getAllAndOverride.mockReturnValue(false)

      const superCanActivateSpy = jest
        .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
        .mockRejectedValue(new Error('Unauthorized'))

      await expect(guard.canActivate(context)).rejects.toThrow('Unauthorized')

      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
      expect(loggingService.debug).toHaveBeenCalledWith('不是公共接口')

      superCanActivateSpy.mockRestore()
    })
  })
})
