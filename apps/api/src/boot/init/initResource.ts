import type { ConfigService } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import type { ResourceTypeEnum } from '@packages/types'
import type { IncomingMessage, Server, ServerResponse } from 'node:http'
import type { ResourceEntity } from '@/modules/rbac/resource/domain'
import { Logger } from '@nestjs/common'
import { ModulesContainer, Reflector } from '@nestjs/core'
import { ResourceTypeCodeMap } from '@packages/types'
import { EntityManager } from 'typeorm'
import { RESOURCE_DOMAIN_KEY, RESOURCE_METHOD_KEY, RESOURCE_TYPE_KEY } from '@/common/deco'
import { CreateResourceDTO } from '@/modules/rbac/resource/app'
import { ResourceDomainService } from '@/modules/rbac/resource/domain'

/**
 * 初始化资源
 * @param appInstance 应用实例
 * @param _configService 配置服务
 * @returns 资源数量
 */
export async function initResource(
  appInstance: NestExpressApplication<Server<typeof IncomingMessage, typeof ServerResponse>>,
  _configService: ConfigService,
): Promise<number> {
  const logger = new Logger(initResource.name)
  logger.log('开始扫描资源...')
  // 所有模块容器
  const modulesContainer = appInstance.get(ModulesContainer)
  // 反射器(用于获取装饰器元信息)
  const reflector = appInstance.get(Reflector)
  const createResourceDTOList: (CreateResourceDTO & { code: string })[] = []
  let limit = 0
  try {
    for (const moduleRef of modulesContainer.values()) {
      const controllers = moduleRef.controllers
      for (const controllerWrapper of controllers.values()) {
        const controllerInstance = controllerWrapper.instance
        const controllerPrototype = Object.getPrototypeOf(controllerInstance)
        const typeCode = reflector.get<string>(RESOURCE_TYPE_KEY, controllerPrototype.constructor)
        const domainCode = reflector.get<string>(RESOURCE_DOMAIN_KEY, controllerPrototype.constructor)
        // 没有就跳过本次
        if (!typeCode || !domainCode) continue
        // 获取控制器上的所有方法(除了构造函数)
        const methodNames = Object.getOwnPropertyNames(controllerPrototype).filter(
          (methodName) => methodName !== 'constructor' && typeof controllerPrototype[methodName] === 'function',
        )
        limit += methodNames.length
        for (const methodName of methodNames) {
          const methodCode = reflector.get<string>(RESOURCE_METHOD_KEY, controllerPrototype[methodName])
          // 没有就跳过本次
          if (!methodCode) continue
          let resourceType: ResourceTypeEnum | undefined
          for (const [enumKey, enumValue] of Object.entries(ResourceTypeCodeMap)) {
            if (enumValue === typeCode) {
              resourceType = Number(enumKey) as ResourceTypeEnum
              break
            }
          }
          if (!resourceType) throw new Error(`未找到资源类型编码对应的枚举值: ${typeCode}`)

          // 初始资源
          const createResourceDTO = new CreateResourceDTO()
          const info = `${domainCode}领域的${methodCode}方法`
          createResourceDTO.name = info
          createResourceDTO.resourceType = resourceType
          createResourceDTO.domain = domainCode
          createResourceDTO.method = methodCode
          createResourceDTO.remark = info
          createResourceDTOList.push({
            ...createResourceDTO,
            code: `${typeCode}:${domainCode}:${methodCode}`,
          })
        }
      }
    }
    logger.log(`√ 扫描成功`)
    // 服务
    const resourceDomainService = appInstance.get(ResourceDomainService)
    // 实体管理器(用于操作数据库)
    const entityManager = appInstance.get(EntityManager)
    await entityManager.transaction(async (em: EntityManager) => {
      // 当前资源情况
      let existingResources: ResourceEntity[] = []
      try {
        const res = await resourceDomainService.getResourcesByCodes(
          createResourceDTOList.map((r) => r.code),
          em,
        )
        existingResources = res
      } catch {
        logger.warn('未找到现有资源，将创建所有新资源')
        existingResources = []
      }
      const codes = new Set<string>()
      const names = new Set<string>()
      existingResources.forEach((r) => {
        codes.add(r.resourceCode)
        names.add(r.name)
      })
      const newResources = createResourceDTOList.filter((r) => !codes.has(r.code) || !names.has(r.name))
      // 资源
      if (newResources.length > 0) {
        logger.log(`发现 ${newResources.length} 个新资源，开始创建...`)
        const createDTOList = newResources.map((r) => {
          const createDTO = new CreateResourceDTO()
          createDTO.domain = r.domain
          createDTO.method = r.method
          createDTO.name = r.name
          createDTO.remark = r.remark
          createDTO.resourceType = r.resourceType
          return createDTO
        })
        try {
          existingResources = await resourceDomainService.createResources(em, createDTOList)
          logger.log(`√ 批量创建资源成功，共创建 ${newResources.length} 个新资源`)
        } catch (err) {
          logger.error(`× 批量创建资源失败${err.message}`, err.stack)
        }
      } else {
        logger.log('没有发现新资源需要创建')
      }
    })
  } catch (err) {
    logger.error(`资源扫描失败${err.message}`, err.stack)
  }
  return limit
}
