import type { CreateRoleDTO } from '../dto'
import type { RoleDetailsVO } from '../vo'
import { Command } from '@nestjs/cqrs'

/** 通过名字创建角色Command */
export class CreateRoleByNameCommand extends Command<RoleDetailsVO> {
  constructor(public readonly createRoleDTO: CreateRoleDTO) {
    super()
  }
}
