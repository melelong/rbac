import type { Response } from 'express'
import type { IAuthController } from '../IAuthController'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiExtraModels } from '@nestjs/swagger'
import { ResourceTypeEnum } from '@packages/types'
import { ApiController, ApiMethod, IsPublic, ResourceDomain, ResourceMethod, ResourceType } from '@/common/deco'
import { FindAllDTO, UpdateSortDTO, UpdateStatusDTO } from '@/common/dto'
import { EmailLoginGuard, EmailRegisterGuard, EmailResetPwdGuard, RefreshTokenGuard, SvgLoginGuard } from '@/common/guards'
import { ResVO } from '@/common/vo'
import { UserDetailsVO } from '@/modules/rbac/user/app'
import {
  AuthDetailsVO,
  AuthIdDTO,
  CaptchaNameDTO,
  CreateAuthByNameCommand,
  CreateAuthDTO,
  DeleteAuthCommand,
  EmailCaptchaDTO,
  EmailLoginDTO,
  EmailRegisterDTO,
  EmailResetPwdDTO,
  FindAllAuthVO,
  GetAuthByIdQuery,
  GetAuthsQuery,
  GetMeInfoQuery,
  GetSvgCaptchaQuery,
  LoginCommand,
  LogoutCommand,
  RefreshTokenCommand,
  RefreshTokenDTO,
  RegisterCommand,
  ResetPwdCommand,
  SendEmailCaptchaCommand,
  SvgCaptchaVO,
  SvgLoginDTO,
  TokenVO,
  UpdateAuthCommand,
  UpdateAuthDTO,
  UpdateAuthSortCommand,
  UpdateAuthStatusCommand,
} from '../../../app'

/** 认证控制器实现 */
@Controller('auth')
@ResourceType(ResourceTypeEnum.API)
@ResourceDomain('AUTH')
@ApiController({ ApiTagsOptions: ['Auth'] })
@ApiExtraModels(FindAllAuthVO, AuthDetailsVO, SvgCaptchaVO, TokenVO, UserDetailsVO)
export class AuthController implements IAuthController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @IsPublic()
  @Get('svg/:name')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '获取SVG验证码' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(SvgCaptchaVO)],
  })
  async svgCaptcha(@Param() captchaNameDTO: CaptchaNameDTO) {
    return await this.queryBus.execute(new GetSvgCaptchaQuery(captchaNameDTO))
  }

  @IsPublic()
  @Post('email/:name')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '发送邮件验证码' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
  })
  async emailCaptcha(@Param() captchaNameDTO: CaptchaNameDTO, @Body() emailCaptchaDTO: EmailCaptchaDTO) {
    return await this.commandBus.execute(new SendEmailCaptchaCommand(captchaNameDTO.name, emailCaptchaDTO.email))
  }

  @IsPublic()
  @UseGuards(SvgLoginGuard)
  @Post('login/svg')
  @ApiMethod({
    ApiOperationOptions: [{ summary: 'SVG登录' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(TokenVO)],
  })
  async svgLogin(@Res({ passthrough: true }) res: Response, @Body() _: SvgLoginDTO) {
    return await this.commandBus.execute(new LoginCommand(res))
  }

  @IsPublic()
  @UseGuards(EmailRegisterGuard)
  @Post('register/email')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '邮箱注册' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
  })
  async emailRegister(@Body() emailRegisterDTO: EmailRegisterDTO) {
    return await this.commandBus.execute(new RegisterCommand(emailRegisterDTO))
  }

  @IsPublic()
  @UseGuards(EmailLoginGuard)
  @Post('login/email')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '邮箱登录' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(TokenVO)],
  })
  async emailLogin(@Res({ passthrough: true }) res: Response, @Body() _: EmailLoginDTO) {
    return await this.commandBus.execute(new LoginCommand(res))
  }

  @IsPublic()
  @UseGuards(EmailResetPwdGuard)
  @Post('reset-pwd/email')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '邮箱重置密码' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
  })
  async emailResetPwd(@Res({ passthrough: true }) res: Response, @Body() _: EmailResetPwdDTO) {
    return await this.commandBus.execute(new ResetPwdCommand(res))
  }

  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '刷新令牌' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(TokenVO)],
  })
  async refreshToken(@Res({ passthrough: true }) res: Response, @Body() _: RefreshTokenDTO) {
    return await this.commandBus.execute(new RefreshTokenCommand(res))
  }

  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '登出' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
  })
  async loginOut(@Res({ passthrough: true }) res: Response, @Body() _: RefreshTokenDTO) {
    return await this.commandBus.execute(new LogoutCommand(res))
  }

  @Get('me')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '获取当前登录用户信息' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(UserDetailsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async meInfo() {
    return await this.queryBus.execute(new GetMeInfoQuery())
  }

  @Post()
  @ResourceMethod('create')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '创建认证' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(AuthDetailsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async create(@Body() createAuthDTO: CreateAuthDTO) {
    return await this.commandBus.execute(new CreateAuthByNameCommand(createAuthDTO))
  }

  @Delete(':id')
  @ResourceMethod('delete')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '删除认证' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async delete(@Param() authIdDTO: AuthIdDTO) {
    return await this.commandBus.execute(new DeleteAuthCommand(authIdDTO.id))
  }

  @Patch(':id')
  @ResourceMethod('update')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '更新认证' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async update(@Param() authIdDTO: AuthIdDTO, @Body() updateAuthDTO: UpdateAuthDTO) {
    return await this.commandBus.execute(new UpdateAuthCommand(authIdDTO.id, updateAuthDTO))
  }

  @Patch(':id/status')
  @ResourceMethod('updateStatus')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '更新认证状态' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async updateStatus(@Param() authIdDTO: AuthIdDTO, @Body() updateStatusDTO: UpdateStatusDTO) {
    return await this.commandBus.execute(new UpdateAuthStatusCommand(authIdDTO.id, updateStatusDTO))
  }

  @Patch(':id/sort')
  @ResourceMethod('updateSort')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '更新认证排序优先级' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async updateSort(@Param() authIdDTO: AuthIdDTO, @Body() updateSortDTO: UpdateSortDTO) {
    return await this.commandBus.execute(new UpdateAuthSortCommand(authIdDTO.id, updateSortDTO))
  }

  @Get()
  @ResourceMethod('list')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '获取认证列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(FindAllAuthVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async list(@Query() findAllDTO: FindAllDTO) {
    return await this.queryBus.execute(new GetAuthsQuery(findAllDTO))
  }

  @Get(':id')
  @ResourceMethod('detail')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '查看单个认证详情' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(AuthDetailsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async detail(@Param() authIdDTO: AuthIdDTO) {
    return await this.queryBus.execute(new GetAuthByIdQuery(authIdDTO.id))
  }
}
