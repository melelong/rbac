import type { ExecutionContext } from '@nestjs/common'
import type { NestExpressApplication } from '@nestjs/platform-express'
import type { Request } from 'express'
import type { IncomingMessage, Server, ServerResponse } from 'node:http'
import { CanActivate, Controller, Get, Injectable, UnauthorizedException, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_GUARD, Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import { ClsModule, ClsService } from 'nestjs-cls'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'

const IS_PUBLIC_KEY = Symbol('IS_PUBLIC_KEY')

const mockLoggingService = {
  debug: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}

jest.mock('@/common/deco', () => ({
  IS_PUBLIC_KEY,
  RESOURCE_DOMAIN_KEY: Symbol('RESOURCE_DOMAIN_KEY'),
  RESOURCE_METHOD_KEY: Symbol('RESOURCE_METHOD_KEY'),
  RESOURCE_TYPE_KEY: Symbol('RESOURCE_TYPE_KEY'),
  LogContextClass: () => (constructor: any) => constructor,
  LogContextMethod: () => () => {},
  IsPublic: () => () => {},
  ResourceType: () => () => {},
  ResourceDomain: () => () => {},
  ResourceMethod: () => () => {},
  ApiController: () => () => {},
  ApiMethod: () => () => {},
}))

jest.mock('@/common/infra/logging', () => ({
  LoggingService: jest.fn().mockImplementation(() => mockLoggingService),
}))

const mockJwtConfig = {
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
  accessTokenCookieExpiresIn: 900000,
  refreshTokenCookieExpiresIn: 604800000,
}

const mockAppConfig = {
  salt: 'test-secret-key-for-jwt-signing',
}

const mockTokenService = {
  getAccessToken: jest.fn((req: Request) => {
    const token =
      (req.headers.authorization?.split(' ')[1] as string) ??
      (req.cookies?.Authorization?.split(' ')[1] as string) ??
      (req.cookies?.authorization?.split(' ')[1] as string)
    return token || null
  }),
  verifyToken: jest.fn(),
  getRefreshCache: jest.fn().mockResolvedValue(null),
  getBlackListCache: jest.fn().mockResolvedValue(null),
  setBlackListCache: jest.fn().mockResolvedValue(undefined),
}

@Injectable()
class MockJwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly clsService: ClsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
    if (isPublic) return true

    const req = context.switchToHttp().getRequest<Request>()
    const accessToken = mockTokenService.getAccessToken(req)
    if (!accessToken) throw new UnauthorizedException()

    let accessInfo: any = null
    try {
      accessInfo = await mockTokenService.verifyToken(accessToken)
    } catch {
      throw new UnauthorizedException()
    }

    if (!accessInfo || accessInfo.type !== 'access') {
      throw new UnauthorizedException()
    }

    const [refreshToken, hasBlackListAccess] = await Promise.all([
      mockTokenService.getRefreshCache(accessInfo.sub),
      mockTokenService.getBlackListCache(accessInfo),
    ])

    if (!refreshToken) {
      await mockTokenService.setBlackListCache(accessInfo, accessToken, mockJwtConfig.accessTokenCookieExpiresIn)
      throw new UnauthorizedException()
    }

    if (hasBlackListAccess) {
      throw new UnauthorizedException()
    }

    this.clsService.set('USER_ID', accessInfo.sub)
    return true
  }
}

@Controller('test')
class TestController {
  @Get('public')
  publicEndpoint() {
    return { message: 'public' }
  }

  @Get('protected')
  protectedEndpoint() {
    return { message: 'protected' }
  }
}

Reflect.defineMetadata(
  IS_PUBLIC_KEY,
  true,
  TestController.prototype,
  Object.getOwnPropertyDescriptor(TestController.prototype, 'publicEndpoint')!.value,
)

describe('authController 鉴权功能测试', () => {
  let app: NestExpressApplication<Server<typeof IncomingMessage, typeof ServerResponse>>
  let jwtService: JwtService
  let jwtSecret: string
  let testUserId: string

  beforeAll(async () => {
    jwtSecret = mockAppConfig.salt
    testUserId = uuidv4()

    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_CONFIG_KEY') return mockJwtConfig
        if (key === 'APP_CONFIG_KEY') return mockAppConfig
        return null
      }),
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PassportModule, ClsModule.forRoot()],
      controllers: [TestController],
      providers: [
        Reflector,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockImplementation((payload: any, options: any) => {
              const secret = options.secret || jwtSecret
              const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
              const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url')
              const signature = Buffer.from(`${header}.${payloadStr}.${secret}`).toString('base64url').slice(0, 43)
              return Promise.resolve(`${header}.${payloadStr}.${signature}`)
            }),
            verifyAsync: jest.fn().mockImplementation(async (token: string, _options: any) => {
              const parts = token.split('.')
              if (parts.length !== 3) throw new Error('invalid token')
              const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
              return payload
            }),
          },
        },
        MockJwtGuard,
        {
          provide: APP_GUARD,
          useClass: MockJwtGuard,
        },
      ],
    }).compile()

    app = moduleFixture.createNestApplication<NestExpressApplication<Server<typeof IncomingMessage, typeof ServerResponse>>>()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )

    jwtService = app.get<JwtService>(JwtService)

    await app.init()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockTokenService.getRefreshCache.mockResolvedValue(null)
    mockTokenService.getBlackListCache.mockResolvedValue(null)
    mockTokenService.verifyToken.mockReset()
  })

  afterAll(async () => {
    if (app) {
      await app.close()
    }
  })

  describe('jWT 鉴权测试', () => {
    describe('无 Token 访问', () => {
      it('无 Token 访问受保护接口应该返回 401', () => {
        return request(app.getHttpServer()).get('/test/protected').expect(401)
      })
    })

    describe('无效 Token 访问', () => {
      it('使用无效 Token 应该返回 401', () => {
        mockTokenService.verifyToken.mockRejectedValue(new Error('invalid'))
        return request(app.getHttpServer()).get('/test/protected').set('Authorization', 'Bearer invalid-token').expect(401)
      })

      it('authorization header 格式错误应该返回 401', async () => {
        const token = await jwtService.signAsync({ sub: testUserId, type: 'access', jti: uuidv4() }, { expiresIn: '1h', secret: jwtSecret })
        return request(app.getHttpServer()).get('/test/protected').set('Authorization', token).expect(401)
      })

      it('authorization header 缺少 Bearer 前缀应该返回 401', async () => {
        const token = await jwtService.signAsync({ sub: testUserId, type: 'access', jti: uuidv4() }, { expiresIn: '1h', secret: jwtSecret })
        return request(app.getHttpServer()).get('/test/protected').set('Authorization', `Token ${token}`).expect(401)
      })
    })

    describe('token 类型测试', () => {
      it('使用 refresh token 作为 access token 应该返回 401', async () => {
        const refreshToken = await jwtService.signAsync({ sub: testUserId, type: 'refresh', jti: uuidv4() }, { expiresIn: '1h', secret: jwtSecret })
        mockTokenService.verifyToken.mockResolvedValueOnce({ sub: testUserId, type: 'refresh', jti: uuidv4() })
        return request(app.getHttpServer()).get('/test/protected').set('Authorization', `Bearer ${refreshToken}`).expect(401)
      })
    })

    describe('缓存验证测试', () => {
      it('使用有效 Token 但无缓存应该返回 401', async () => {
        const token = await jwtService.signAsync({ sub: uuidv4(), type: 'access', jti: uuidv4() }, { expiresIn: '1h', secret: jwtSecret })
        mockTokenService.verifyToken.mockResolvedValueOnce({ sub: uuidv4(), type: 'access', jti: uuidv4() })
        mockTokenService.getRefreshCache.mockResolvedValueOnce(null)
        return request(app.getHttpServer()).get('/test/protected').set('Authorization', `Bearer ${token}`).expect(401)
      })

      it('token 在黑名单中应该返回 401', async () => {
        const jti = uuidv4()
        const token = await jwtService.signAsync({ sub: testUserId, type: 'access', jti }, { expiresIn: '1h', secret: jwtSecret })
        mockTokenService.verifyToken.mockResolvedValueOnce({ sub: testUserId, type: 'access', jti })
        mockTokenService.getRefreshCache.mockResolvedValueOnce('valid-refresh-token')
        mockTokenService.getBlackListCache.mockResolvedValueOnce('blacklisted')
        return request(app.getHttpServer()).get('/test/protected').set('Authorization', `Bearer ${token}`).expect(401)
      })
    })
  })
})
