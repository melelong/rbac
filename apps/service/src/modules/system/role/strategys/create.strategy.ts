import type { EntityManager } from 'typeorm'
import type { CreateRoleDTO } from '../dto'
import type { ITransactionTemplateStrategy } from '@/common/template'
import { RoleBusiness, RoleBusinessTextMap } from '@packages/types'
import { BusinessException } from '@/common/exceptions'
import { RoleEntity } from '../entities/role.entity'
import { RoleTreeEntity } from '../entities/roleTree.entity'
import { RoleVO } from '../vo'

export interface ICreateRoleStrategyOptions {
  /** 创建参数 */
  createRoleDTO: CreateRoleDTO
  /** 操作者 */
  by: string
}

interface IValidateValue {
  /** 操作者 */
  by: string
  /** 备注 */
  remark?: string
  /** 角色编码 */
  roleCode: string
  /** 父角色ID */
  parentId?: string
  /** 角色名 */
  name: string
}
export class CreateRoleStrategy implements ITransactionTemplateStrategy<RoleVO, IValidateValue> {
  private readonly createRoleDTO: CreateRoleDTO
  private readonly by: string
  constructor(options: ICreateRoleStrategyOptions) {
    const { createRoleDTO, by } = options
    this.createRoleDTO = createRoleDTO
    this.by = by
  }

  async validate(em: EntityManager): Promise<IValidateValue> {
    const { name, roleCode, parentId, remark } = this.createRoleDTO
    const by = this.by
    const [hasName, hasCode, hasParentRole] = await Promise.all([
      em.findOne(RoleEntity, { where: { name }, lock: { mode: 'pessimistic_write' } }),
      em.findOne(RoleEntity, { where: { roleCode }, lock: { mode: 'pessimistic_write' } }),
      parentId ? em.findOne(RoleEntity, { where: { id: parentId }, lock: { mode: 'pessimistic_write' } }) : null,
    ])
    if (hasName) throw new BusinessException(RoleBusiness.NAME_ALREADY_EXISTS, RoleBusinessTextMap)
    if (hasCode) throw new BusinessException(RoleBusiness.CODE_ALREADY_EXISTS, RoleBusinessTextMap)
    if (parentId && !hasParentRole) throw new BusinessException(RoleBusiness.NOT_FOUND, RoleBusinessTextMap)

    return { by, remark, roleCode, parentId, name }
  }

  async handler(em: EntityManager, { by, remark, roleCode, parentId, name }: IValidateValue) {
    // 创建角色
    const now = new Date()
    const newRole = em.create(RoleEntity, {
      name,
      roleCode,
      parentId,
      remark,
      createdBy: by,
      createdAt: now,
      updatedBy: by,
      updatedAt: now,
    })
    const role = await em.save(RoleEntity, newRole)
    // 保存关系
    const roleId = role.id
    const selfTreeRelation = em.create(RoleTreeEntity, {
      ancestorId: roleId,
      descendantId: roleId,
      depth: 0,
    })
    await em.save(RoleTreeEntity, selfTreeRelation)

    // 有父角色
    if (parentId) {
      const parentTreeRelations = await em
        .createQueryBuilder(RoleTreeEntity, 'tree')
        .select('tree.ancestor_id', 'ancestorId')
        .addSelect('tree.depth', 'depth')
        .where('tree.descendant_id = :parentId', { parentId })
        .setLock('pessimistic_write')
        .getRawMany()

      const newTreeRelations = parentTreeRelations.map((item) => ({
        ancestorId: item.ancestorId,
        descendantId: roleId,
        depth: item.depth + 1,
      }))

      await em.save(RoleTreeEntity, newTreeRelations)
    }

    return new RoleVO(role)
  }
}
