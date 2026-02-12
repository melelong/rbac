import type { FindAllMenuVO } from '../vo'
import type { FindAllDTO } from '@/common/dto'
import { Query } from '@nestjs/cqrs'

/** 获取菜单列表Query */
export class GetMenusQuery extends Query<FindAllMenuVO> {
  constructor(public readonly findAllDTO: FindAllDTO) {
    super()
  }
}
