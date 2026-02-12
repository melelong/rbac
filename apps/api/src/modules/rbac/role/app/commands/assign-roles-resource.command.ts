import type { AssignRolesResourceDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 批量给角色分配资源Command */
export class AssignRolesResourceCommand extends Command<never[]> {
  constructor(public readonly assignRolesResourceDTO: AssignRolesResourceDTO) {
    super()
  }
}
