import type { AssignRoleMenuDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 给角色分配菜单Command */
export class AssignRoleMenuCommand extends Command<never[]> {
  constructor(public readonly assignRoleMenuDTO: AssignRoleMenuDTO) {
    super()
  }
}
