import type { IResourceEntity } from '../IResourceEntity'
import { ResourceTypeEnum } from '@packages/types'
import { Column, Entity, Index, ManyToMany } from 'typeorm'
import { CODE_MAX } from '@/common/constants'
import { CommonEntity } from '@/common/entities'
import { RoleEntity } from '@/modules/rbac/role/domain'
import {
  RESOURCE_CODE,
  RESOURCE_DOMAIN,
  RESOURCE_DOMAIN_MAX,
  RESOURCE_METHOD,
  RESOURCE_METHOD_MAX,
  RESOURCE_NAME,
  RESOURCE_NAME_MAX,
  RESOURCE_TABLE,
  RESOURCE_TYPE,
} from '../../../domain'

/** 资源表实体实现 */
@Entity({ name: RESOURCE_TABLE, comment: '资源表' })
@Index(['name'])
export class ResourceEntity extends CommonEntity implements IResourceEntity {
  @Column({
    comment: RESOURCE_NAME,
    name: 'name',
    type: 'varchar',
    length: RESOURCE_NAME_MAX,
    charset: 'utf8mb4',
  })
  name: string

  @Column({
    comment: RESOURCE_CODE,
    name: 'resource_code',
    type: 'varchar',
    length: CODE_MAX,
  })
  resourceCode: string

  @Column({
    comment: RESOURCE_TYPE,
    name: 'resource_type',
    type: 'tinyint',
    unsigned: true,
    default: ResourceTypeEnum.API,
  })
  resourceType: ResourceTypeEnum

  @Column({
    comment: RESOURCE_DOMAIN,
    name: 'domain',
    type: 'varchar',
    length: RESOURCE_DOMAIN_MAX,
  })
  domain: string

  @Column({
    comment: RESOURCE_METHOD,
    name: 'method',
    type: 'varchar',
    length: RESOURCE_METHOD_MAX,
  })
  method: string

  @ManyToMany(() => RoleEntity, (role) => role.resources)
  roles: RoleEntity[]
}
