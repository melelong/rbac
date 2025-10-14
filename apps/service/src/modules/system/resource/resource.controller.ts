import type { IResourceController } from './IResource'
import { Controller, Post } from '@nestjs/common'
import { ApiController, ApiMethod } from '@/common/decorators'

import { ResourceService } from './resource.service'
import { ResourceVO } from './vo'

@Controller('resource')
@ApiController({ ApiTagsOptions: ['资源模块'] })
export class ResourceController implements IResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @ApiMethod({
    ApiOperationOptions: [{ summary: '创建资源' }],
    ApiResponseOptions: [{ type: ResourceVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async create() {
    return await this.resourceService.create()
  }
}
