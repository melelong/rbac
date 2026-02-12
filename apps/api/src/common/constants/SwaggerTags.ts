import type { TagObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

export const SwaggerTags: TagObject[] = [
  { name: 'Menu', description: '菜单模块' },
  { name: 'Resource', description: '资源模块' },
  { name: 'RoleMenu', description: '角色菜单模块' },
  { name: 'RoleResource', description: '角色资源模块' },
  { name: 'Role', description: '角色模块' },
  { name: 'UserRole', description: '用户角色模块' },
  { name: 'User', description: '用户模块' },
  { name: 'Auth', description: '认证模块' },
]
