import type { ConfigService } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import type { IncomingMessage, Server, ServerResponse } from 'node:http'
import type { RoleEntity } from '@/modules/rbac/role/domain'
import { Logger } from '@nestjs/common'
import { DataScopeEnum } from '@packages/types'
import { EntityManager } from 'typeorm'
import { FindAllDTO } from '@/common/dto'
import { ResourceDomainService } from '@/modules/rbac/resource/domain'
import { CreateRoleDTO, RoleResourceService } from '@/modules/rbac/role/app'
import { DEFAULT_ROLES, RoleDomainService } from '@/modules/rbac/role/domain'

/**
 * 初始化角色
 * @param appInstance 应用实例
 * @param _configService 配置服务
 * @param limit 资源数量
 */
export async function initRole(
  appInstance: NestExpressApplication<Server<typeof IncomingMessage, typeof ServerResponse>>,
  _configService: ConfigService,
  limit: number = 1000,
) {
  const logger = new Logger(initRole.name)
  logger.log('开始扫描角色...')
  const createRoleDTOList: CreateRoleDTO[] = []
  try {
    // 服务
    const resourceDomainService = appInstance.get(ResourceDomainService)
    const roleDomainService = appInstance.get(RoleDomainService)
    const roleResourceService = appInstance.get(RoleResourceService)
    // 实体管理器(用于操作数据库)
    const entityManager = appInstance.get(EntityManager)

    const findAllDTO = new FindAllDTO()
    findAllDTO.limit = limit
    const [allResources] = await resourceDomainService.getResources(findAllDTO)
    for (const key in DEFAULT_ROLES) {
      const role = DEFAULT_ROLES[key]
      const createRoleDTO = new CreateRoleDTO()
      createRoleDTO.name = role.name
      createRoleDTO.roleCode = role.roleCode
      createRoleDTO.dataScope = role.name === DEFAULT_ROLES.SUPER_ADMIN.name ? DataScopeEnum.ALL : DataScopeEnum.SELF
      createRoleDTOList.push(createRoleDTO)
    }
    logger.log(`√ 扫描成功`)
    await entityManager.transaction(async (em: EntityManager) => {
      // 当前角色情况
      let existingRoles: RoleEntity[] = []
      try {
        const res = await roleDomainService.getRolesByCodes(
          createRoleDTOList.map((r) => r.roleCode),
          false,
          em,
        )
        existingRoles = res
      } catch {
        logger.warn('未找到现有角色，将创建所有新角色')
        existingRoles = []
      }
      const codes = new Set<string>()
      const names = new Set<string>()
      existingRoles.forEach((r) => {
        codes.add(r.roleCode)
        names.add(r.name)
      })
      const newRoles = createRoleDTOList.filter((r) => !codes.has(r.roleCode) || !names.has(r.name))
      // 角色
      if (newRoles.length > 0) {
        logger.log(`发现 ${newRoles.length} 个新角色，开始创建...`)
        const createDTOList = newRoles.map((r) => {
          const createDTO = new CreateRoleDTO()
          createDTO.dataScope = r.dataScope
          createDTO.name = r.name
          createDTO.roleCode = r.roleCode
          createDTO.remark = r.remark
          return createDTO
        })
        try {
          existingRoles = await roleDomainService.createRoles(em, createDTOList)
          const SUPER_ADMIN_RESOURCE: string[] = []
          let SUPER_ADMIN_ID: string = ''
          const ADMIN_RESOURCE: string[] = []
          let ADMIN_ID: string = ''
          const USER_RESOURCE: string[] = []
          let USER_ID: string = ''
          for (const r of existingRoles) {
            if (SUPER_ADMIN_ID && ADMIN_ID && USER_ID) break
            const roleMap = {
              [DEFAULT_ROLES.SUPER_ADMIN.name]: () => {
                SUPER_ADMIN_ID = r.id
              },
              [DEFAULT_ROLES.ADMIN.name]: () => {
                ADMIN_ID = r.id
              },
              [DEFAULT_ROLES.USER.name]: () => (USER_ID = r.id),
            }
            roleMap[r.name]?.()
          }
          allResources.forEach((r) => {
            // 超管资源权限(全部资源权限)
            SUPER_ADMIN_RESOURCE.push(r.id)
            // 管理员资源权限(不能删)
            if (r.method !== 'DELETE') ADMIN_RESOURCE.push(r.id)
            // 用户资源权限(只读)
            if (r.method === 'LIST' || r.method === 'DETAIL') USER_RESOURCE.push(r.id)
          })
          // console.warn(SUPER_ADMIN_ID)
          // console.warn(ADMIN_ID)
          // console.warn(USER_ID)
          // const a = await roleDomainService.getRolesByIds([SUPER_ADMIN_ID, ADMIN_ID, USER_ID], false, em)
          // console.warn(a)
          // 调整层级
          if (SUPER_ADMIN_ID && ADMIN_ID && USER_ID) await roleDomainService.moveRoles(em, [ADMIN_ID, USER_ID], [SUPER_ADMIN_ID, ADMIN_ID])
          // 分配资源权限
          await Promise.all([
            SUPER_ADMIN_ID ? roleResourceService.assignRolesResourceByIds(em, { ids: [SUPER_ADMIN_ID], resourceIds: SUPER_ADMIN_RESOURCE }) : null,
            ADMIN_ID ? roleResourceService.assignRolesResourceByIds(em, { ids: [ADMIN_ID], resourceIds: ADMIN_RESOURCE }) : null,
            USER_ID ? roleResourceService.assignRolesResourceByIds(em, { ids: [USER_ID], resourceIds: USER_RESOURCE }) : null,
          ])
          logger.log(`√ 批量创建角色成功，共创建 ${newRoles.length} 个新角色`)
        } catch (err) {
          logger.error(`× 批量创建角色失败${err.message}`, err.stack)
        }
      } else {
        logger.log('没有发现新角色需要创建')
      }
    })
  } catch (err) {
    logger.error(`角色扫描失败${err.message}`, err.stack)
  }
}
