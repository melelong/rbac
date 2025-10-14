import type { IDeptController } from './IDept'
import { Controller, Post } from '@nestjs/common'
import { ApiController, ApiMethod } from '@/common/decorators'
import { DeptService } from './dept.service'
import { DeptVO } from './vo'

@Controller('dept')
@ApiController({ ApiTagsOptions: ['部门模块'] })
export class DeptController implements IDeptController {
  constructor(private readonly deptService: DeptService) {}
  @Post()
  @ApiMethod({
    ApiOperationOptions: [{ summary: '创建部门' }],
    ApiResponseOptions: [{ type: DeptVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async create() {
    return await this.deptService.create()
  }
}
