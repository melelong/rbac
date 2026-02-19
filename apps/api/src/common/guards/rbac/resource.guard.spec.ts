import type { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'

import { RESOURCE_DOMAIN_KEY, RESOURCE_METHOD_KEY, RESOURCE_TYPE_KEY } from '@/common/deco'
import { ResourceGuard } from '@/common/guards/rbac/resource.guard'
import { LoggingService } from '@/common/infra/logging'

jest.mock('@/common/deco', () => ({
  RESOURCE_DOMAIN_KEY: Symbol('RESOURCE_DOMAIN_KEY'),
  RESOURCE_METHOD_KEY: Symbol('RESOURCE_METHOD_KEY'),
  RESOURCE_TYPE_KEY: Symbol('RESOURCE_TYPE_KEY'),
  LogContextClass: () => (constructor: any) => constructor,
}))

jest.mock('@/common/infra/logging', () => ({
  LoggingService: jest.fn().mockImplementation(() => ({
    debug: jest.fn(),
  })),
}))

describe('resourceGuard', () => {
  let guard: ResourceGuard
  let _reflector: Reflector
  let loggingService: LoggingService

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  }

  const mockLoggingService = {
    debug: jest.fn(),
  }

  const mockExecutionContext = (overrides: Partial<ExecutionContext> = {}): ExecutionContext => {
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => ({ headers: {}, cookies: {} }),
        getResponse: () => ({}),
      }),
      getHandler: jest.fn().mockReturnValue({}),
      getClass: jest.fn().mockReturnValue({}),
      ...overrides,
    } as ExecutionContext
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceGuard, { provide: Reflector, useValue: mockReflector }, { provide: LoggingService, useValue: mockLoggingService }],
    }).compile()

    guard = module.get<ResourceGuard>(ResourceGuard)
    _reflector = module.get<Reflector>(Reflector)
    loggingService = module.get<LoggingService>(LoggingService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('canActivate', () => {
    it('当没有资源元数据时应该放行', async () => {
      const context = mockExecutionContext()
      mockReflector.getAllAndOverride.mockReturnValueOnce(undefined).mockReturnValueOnce(undefined).mockReturnValueOnce(undefined)

      const result = await guard.canActivate(context)

      expect(result).toBe(true)
    })

    it('当只有部分资源元数据时应该放行', async () => {
      const context = mockExecutionContext()
      mockReflector.getAllAndOverride.mockReturnValueOnce('API').mockReturnValueOnce(undefined).mockReturnValueOnce('create')

      const result = await guard.canActivate(context)

      expect(result).toBe(true)
    })

    it('当有完整资源元数据时应该生成资源编码并放行', async () => {
      const context = mockExecutionContext()
      mockReflector.getAllAndOverride.mockReturnValueOnce('API').mockReturnValueOnce('AUTH').mockReturnValueOnce('CREATE')

      const result = await guard.canActivate(context)

      expect(result).toBe(true)
      expect(loggingService.debug).toHaveBeenCalledWith('API:AUTH:CREATE')
    })

    it('当资源类型为空时应该放行', async () => {
      const context = mockExecutionContext()
      mockReflector.getAllAndOverride.mockReturnValueOnce('').mockReturnValueOnce('AUTH').mockReturnValueOnce('CREATE')

      const result = await guard.canActivate(context)

      expect(result).toBe(true)
    })

    it('当资源域为空时应该放行', async () => {
      const context = mockExecutionContext()
      mockReflector.getAllAndOverride.mockReturnValueOnce('API').mockReturnValueOnce('').mockReturnValueOnce('CREATE')

      const result = await guard.canActivate(context)

      expect(result).toBe(true)
    })

    it('当资源方法为空时应该放行', async () => {
      const context = mockExecutionContext()
      mockReflector.getAllAndOverride.mockReturnValueOnce('API').mockReturnValueOnce('AUTH').mockReturnValueOnce('')

      const result = await guard.canActivate(context)

      expect(result).toBe(true)
    })

    it('应该正确获取类级别和方法级别的元数据', async () => {
      const context = mockExecutionContext()

      mockReflector.getAllAndOverride.mockReturnValueOnce('API').mockReturnValueOnce('AUTH').mockReturnValueOnce('CREATE')

      await guard.canActivate(context)

      expect(mockReflector.getAllAndOverride).toHaveBeenCalledTimes(3)
      expect(mockReflector.getAllAndOverride).toHaveBeenNthCalledWith(1, RESOURCE_TYPE_KEY, expect.any(Array))
      expect(mockReflector.getAllAndOverride).toHaveBeenNthCalledWith(2, RESOURCE_DOMAIN_KEY, expect.any(Array))
      expect(mockReflector.getAllAndOverride).toHaveBeenNthCalledWith(3, RESOURCE_METHOD_KEY, expect.any(Array))
    })
  })
})
