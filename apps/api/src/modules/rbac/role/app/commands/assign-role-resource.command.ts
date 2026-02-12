import type { AssignRoleResourceDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 给角色分配资源Command */
export class AssignRoleResourceCommand extends Command<never[]> {
  constructor(public readonly assignRoleResourceDTO: AssignRoleResourceDTO) {
    super()
  }
}
