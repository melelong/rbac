import type { FindAllRoleVO } from '../vo'
import type { FindAllDTO } from '@/common/dto'
import { Query } from '@nestjs/cqrs'

/** 获取角色列表Query */
export class GetRolesQuery extends Query<FindAllRoleVO> {
  constructor(public readonly findAllDTO: FindAllDTO) {
    super()
  }
}
