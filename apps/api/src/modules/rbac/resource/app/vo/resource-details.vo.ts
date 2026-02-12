import type { IResourceDetailsVO, ResourceTypeEnum } from '@packages/types'
import type { ResourceEntity } from '../../domain'
import { ApiSchema } from '@nestjs/swagger'
import { omit } from 'lodash-es'
import { BaseVO } from '@/common/vo'

/** 资源详情 */
@ApiSchema({ description: '资源详情' })
export class ResourceDetailsVO extends BaseVO implements IResourceDetailsVO {
  /**
   * 资源名
   * @example '资源名'
   */
  name: string
  /**
   * 资源编码(资源类型:领域:方法)
   * @example 'API:SYSTEM_USER:CREATE'
   */
  resourceCode: string
  /**
   * 资源类型(接口:10 静态资源:20 WebSocket连接点:30 定时任务:40 数据权限:50)
   * @example 10
   */
  resourceType: ResourceTypeEnum
  /**
   * 领域
   * @example 'SYSTEM'
   */
  domain: string
  /**
   * 方法
   * @example 'CREATE'
   */
  method: string
  /**
   * 资源ID
   * @example 'xxx'
   */
  id: string
  constructor(resource?: ResourceEntity) {
    super()
    if (resource) {
      const keys = ['_id', 'roles']
      const omitResult = omit(resource, keys)
      Object.assign(this, omitResult)
    }
  }
}
