import type { ICreateMenuDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { CheckEnum, MenuTypeEnum } from '@packages/types'
import { IsEnum, IsOptional } from 'class-validator'
import { REMARK } from '@/common/constants'
import { InputCode, InputSpace, InputTrim, Length, NotEmpty } from '@/common/deco'
import { MENU_ACTION, MENU_COMPONENT, MENU_DOMAIN, MENU_ICON, MENU_NAME, MENU_PARENT_ID, MENU_PATH, MENU_QUERY } from '../../domain'

/** 创建菜单接口参数校验 */
@ApiSchema({ description: '菜单名参数校验' })
export class CreateMenuDTO implements ICreateMenuDTO {
  /**
   * 父节点ID
   * @example 'xxx'
   */
  @Length(36, 36, MENU_PARENT_ID)
  @InputSpace(MENU_PARENT_ID)
  @IsOptional()
  parentId?: string

  /**
   * 菜单名
   * @example '菜单名'
   */
  @Length(2, 64, MENU_NAME)
  @InputTrim(MENU_NAME)
  @NotEmpty(MENU_NAME)
  name: string

  /**
   * 菜单类型(10:菜单 20:按钮 30:组件 40:目录 50:外链 60:内链)
   * @example 10
   */
  @IsEnum(MenuTypeEnum, { message: '请输入正确的菜单类型枚举' })
  @NotEmpty(MENU_NAME)
  menuType: MenuTypeEnum

  /**
   * 菜单领域
   * @example 'USER'
   */
  @InputCode(MENU_DOMAIN)
  @Length(2, 40, MENU_DOMAIN)
  @InputSpace(MENU_DOMAIN)
  @NotEmpty(MENU_DOMAIN)
  domain: string

  /**
   * 菜单操作类型
   * @example 'MANAGEMENT'
   */
  @InputCode(MENU_ACTION)
  @Length(2, 40, MENU_ACTION)
  @InputSpace(MENU_ACTION)
  @NotEmpty(MENU_ACTION)
  action: string

  /**
   * 访问路径(MENU,LINK,INNER_LINK)
   * @example '/user'
   */
  @Length(1, 2048, MENU_PATH)
  @InputSpace(MENU_PATH)
  @NotEmpty(MENU_PATH)
  path: string

  /**
   * 路由参数(MENU)
   * @example '{id:"xxx"}'
   */
  @Length(1, 2048, MENU_QUERY)
  @InputSpace(MENU_QUERY)
  @IsOptional()
  query?: string

  /**
   * 组件路径(COMPONENT)
   * @example 'UserButton'
   */
  @Length(1, 2048, MENU_COMPONENT)
  @InputSpace(MENU_COMPONENT)
  @IsOptional()
  component?: string

  /**
   * 图标地址(MENU,DIRECTORY,LINK,INNER_LINK)
   * @example 'https://www.icon.com'
   */
  @Length(1, 2048, MENU_ICON)
  @InputSpace(MENU_ICON)
  @IsOptional()
  icon?: string

  /**
   * 是否缓存(MENU,COMPONENT,INNER_LINK)
   * @example 10
   */
  @IsEnum(CheckEnum, { message: '请输入正确的是否缓存枚举' })
  @IsOptional()
  isCache?: CheckEnum

  /**
   * 是否隐藏(MENU)
   * @example 10
   */
  @IsEnum(CheckEnum, { message: '请输入正确的是否隐藏枚举' })
  @IsOptional()
  isVisible?: CheckEnum

  /**
   * 是否刷新(MENU)
   * @example 10
   */
  @IsEnum(CheckEnum, { message: '请输入正确的是否刷新枚举' })
  @IsOptional()
  isRefresh?: CheckEnum

  /**
   * 备注
   * @example 'xxx'
   */
  @Length(1, 500, REMARK)
  @InputTrim(REMARK)
  @IsOptional()
  remark?: string
}
