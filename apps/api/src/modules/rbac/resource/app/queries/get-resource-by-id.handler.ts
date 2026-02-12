import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { ResourceDomainService } from '../../domain'
import { ResourceVOAssembler } from '../assemblers'
import { GetResourceByIdQuery } from './get-resource-by-id.query'

/** 获取资源详情Handler */
@QueryHandler(GetResourceByIdQuery)
export class GetResourceByIdHandler implements IQueryHandler<GetResourceByIdQuery> {
  constructor(private readonly resourceDomainService: ResourceDomainService) {}
  async execute(query: GetResourceByIdQuery) {
    const [resource] = await this.resourceDomainService.getResourcesByIds([query.id])
    return ResourceVOAssembler.toDetailsVO(resource)
  }
}
