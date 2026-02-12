import type { AssignRolesMenuDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 批量给角色分配菜单Command */
export class AssignRolesMenuCommand extends Command<never[]> {
  constructor(public readonly assignRolesMenuDTO: AssignRolesMenuDTO) {
    super()
  }
}
