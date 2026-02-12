import type { ExcludeKeys } from '@/common/utils'
import type { IFindAllVOOptions } from '@/common/vo'
import { MenuEntity } from '../../domain'
import { FindAllMenuVO, MenuDetailsVO, MenuIdsVO } from '../vo'

/** 菜单转换器 */
export class MenuVOAssembler {
  /** 将实体转换为详情VO */
  static toDetailsVO(menu: MenuEntity) {
    return new MenuDetailsVO(menu)
  }

  /** 将实体转换为分页VO */
  static toFindAllVO(options: ExcludeKeys<IFindAllVOOptions<MenuEntity>, 'DataConstructor'>) {
    const { data, limit, page, total } = options
    return new FindAllMenuVO({ DataConstructor: MenuDetailsVO, data, limit, page, total })
  }

  /** 将实体列表转换为ID列表VO */
  static toIdsVO(menus: MenuEntity[]) {
    return new MenuIdsVO(menus)
  }
}
