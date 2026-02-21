import type { ConfigService } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import type { IncomingMessage, Server, ServerResponse } from 'node:http'
import type { IAppConfig } from '@/config'
import type { UserEntity } from '@/modules/rbac/user/domain'
import { Logger } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { APP_CONFIG_KEY } from '@/config'
import { DEFAULT_ROLES, RoleDomainService } from '@/modules/rbac/role/domain'
import { CreateUserDTO, UserRoleService } from '@/modules/rbac/user/app'
import { UserDomainService } from '@/modules/rbac/user/domain'

/**
 * 初始化用户
 * @param appInstance 应用实例
 * @param configService 配置服务
 */
export async function initUser(
  appInstance: NestExpressApplication<Server<typeof IncomingMessage, typeof ServerResponse>>,
  configService: ConfigService,
) {
  const logger = new Logger(initUser.name)
  logger.log('开始扫描用户...')
  const createUserDTOList: CreateUserDTO[] = []
  try {
    const { initUser } = configService.get<IAppConfig>(APP_CONFIG_KEY)!
    // 服务
    const roleDomainService = appInstance.get(RoleDomainService)
    const userDomainService = appInstance.get(UserDomainService)
    const userRoleService = appInstance.get(UserRoleService)
    // 实体管理器(用于操作数据库)
    const entityManager = appInstance.get(EntityManager)

    const roleCodes: string[] = [DEFAULT_ROLES.SUPER_ADMIN.roleCode, DEFAULT_ROLES.ADMIN.roleCode, DEFAULT_ROLES.USER.roleCode]
    const allRoles = await roleDomainService.getRolesByCodes(roleCodes)
    for (const key in initUser) {
      const user = initUser[key]
      const createUserDTO = new CreateUserDTO()
      if (user.email) createUserDTO.email = user.email
      createUserDTO.name = user.name
      createUserDTO.pwd = user.pwd
      createUserDTOList.push(createUserDTO)
    }
    logger.log(`√ 扫描成功`)
    await entityManager.transaction(async (em: EntityManager) => {
      // 当前用户情况
      let existingUsers: UserEntity[] = []
      try {
        const res = await userDomainService.getUsersByNames(
          createUserDTOList.map((u) => u.name),
          false,
          em,
        )
        existingUsers = res
      } catch {
        logger.warn('未找到现有用户，将创建所有新用户')
        existingUsers = []
      }
      const emails = new Set<string | null>()
      const names = new Set<string>()
      existingUsers.forEach((u) => {
        emails.add(u.profile.email)
        names.add(u.name)
      })
      const newUsers = createUserDTOList.filter((u) => !emails.has(u.email ?? null) || !names.has(u.name))
      // 用户
      if (newUsers.length > 0) {
        logger.log(`发现 ${newUsers.length} 个新用户，开始创建...`)
        const createDTOList = newUsers.map((u) => {
          const createDTO = new CreateUserDTO()
          if (u.email) createDTO.email = u.email
          createDTO.name = u.name
          createDTO.pwd = u.pwd
          createDTO.remark = u.remark
          return createDTO
        })
        try {
          existingUsers = await userDomainService.createUsers(em, createDTOList)
          const SUPER_ADMIN_ROLE: string[] = []
          let SUPER_ADMIN_ID: string = ''
          const ADMIN_ROLE: string[] = []
          let ADMIN_ID: string = ''
          const USER_ROLE: string[] = []
          let USER_ID: string = ''
          for (const u of existingUsers) {
            if (SUPER_ADMIN_ID && ADMIN_ID && USER_ID) break
            const roleMap = {
              [initUser.super.name]: () => (SUPER_ADMIN_ID = u.id),
              [initUser.admin.name]: () => (ADMIN_ID = u.id),
              [initUser.user.name]: () => (USER_ID = u.id),
            }
            roleMap[u.name]?.()
          }
          for (const r of allRoles) {
            if (SUPER_ADMIN_ROLE.length === 1 && ADMIN_ROLE.length === 1 && USER_ROLE.length === 1) break
            const roleMap = {
              [DEFAULT_ROLES.SUPER_ADMIN.roleCode]: () => SUPER_ADMIN_ROLE.push(r.id),
              [DEFAULT_ROLES.ADMIN.roleCode]: () => ADMIN_ROLE.push(r.id),
              [DEFAULT_ROLES.USER.roleCode]: () => USER_ROLE.push(r.id),
            }
            roleMap[r.roleCode]?.()
          }
          // 分配资源权限
          await Promise.all([
            SUPER_ADMIN_ID ? userRoleService.assignUsersRoleByIds(em, { ids: [SUPER_ADMIN_ID], roleIds: SUPER_ADMIN_ROLE }) : null,
            ADMIN_ID ? userRoleService.assignUsersRoleByIds(em, { ids: [ADMIN_ID], roleIds: ADMIN_ROLE }) : null,
            USER_ID ? userRoleService.assignUsersRoleByIds(em, { ids: [USER_ID], roleIds: USER_ROLE }) : null,
          ])
          logger.log(`√ 批量创建用户成功，共创建 ${newUsers.length} 个新用户`)
        } catch (err) {
          logger.error(`× 批量创建用户失败${err.message}`, err.stack)
        }
      } else {
        logger.log('没有发现新用户需要创建')
      }
    })
  } catch (err) {
    logger.error(`用户扫描失败${err.message}`)
  }
}
