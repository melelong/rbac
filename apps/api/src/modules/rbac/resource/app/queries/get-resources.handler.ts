import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { ResourceDomainService } from '../../domain'
import { ResourceVOAssembler } from '../assemblers'
import { GetResourcesQuery } from './get-resources.query'

/** 获取资源列表Handler */
@QueryHandler(GetResourcesQuery)
export class GetResourcesHandler implements IQueryHandler<GetResourcesQuery> {
  constructor(private readonly resourceDomainService: ResourceDomainService) {}
  async execute(query: GetResourcesQuery) {
    const { limit = 10, page = 1 } = query.findAllDTO
    const [data, total] = await this.resourceDomainService.getResources(query.findAllDTO)
    return ResourceVOAssembler.toFindAllVO({ data, limit, page, total })
  }
}
