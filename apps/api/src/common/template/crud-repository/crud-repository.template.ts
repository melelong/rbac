import type { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, ObjectLiteral } from 'typeorm'
import type { ICrudRepositoryTemplate } from './ICrudRepositoryTemplate'
import type { FindAllDTO } from '@/common/dto'
import type { LoggingService } from '@/common/infra'
import { OrderTypeEnum } from '@packages/types'
import { EntityManager, In, Like, Repository } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'

/**
 * CRUD仓库抽象模板类(实体要继承commonEntity)
 * 提供通用的增删改查实现
 */
export abstract class CrudRepositoryTemplate<T extends ObjectLiteral> extends Repository<T> implements ICrudRepositoryTemplate<T> {
  constructor(
    protected readonly entityClass: new () => T,
    protected readonly entityManager: EntityManager,
    protected readonly loggingService: LoggingService,
  ) {
    super(entityClass, entityManager)
  }

  @LogContextMethod()
  async addMany(entityList: T[], by: string = SYSTEM_DEFAULT_BY, em?: EntityManager) {
    this.loggingService.debug('run')
    if (entityList.length <= 0) return []
    const now = new Date()
    const list = (entityList = entityList.map((item: any) => ({ ...item, createdBy: by, createdAt: now, updatedBy: by, updatedAt: now }) as T))
    return em ? await em.save(this.entityClass, list) : await this.save(list)
  }

  @LogContextMethod()
  async deleteMany(entityList: T[], by: string = SYSTEM_DEFAULT_BY, em?: EntityManager) {
    this.loggingService.debug('run')
    if (entityList.length <= 0) return true
    const now = new Date()
    const deleteEntityList = entityList.map((item) => this.create({ ...item, deletedBy: by, deletedAt: now } as unknown as DeepPartial<T>))
    const result = em ? await em.upsert(this.entityClass, deleteEntityList, ['id']) : await this.upsert(deleteEntityList, ['id'])
    return result.identifiers.length === entityList.length
  }

  @LogContextMethod()
  async patch(entityList: T[], by: string = SYSTEM_DEFAULT_BY, em?: EntityManager) {
    this.loggingService.debug('run')
    if (entityList.length <= 0) return true
    const now = new Date()
    const patchEntityList = entityList.map((item) => this.create({ ...item, updatedBy: by, updatedAt: now } as unknown as DeepPartial<T>))
    const result = em ? await em.upsert(this.entityClass, patchEntityList, ['id']) : await this.upsert(patchEntityList, ['id'])
    return result.identifiers.length === entityList.length
  }

  @LogContextMethod()
  async findManyById(idList: string[], relations?: boolean, em?: EntityManager) {
    this.loggingService.debug('run')
    if (idList.length <= 0) return []
    const where = { id: idList.length === 1 ? idList[0] : In(idList) } as unknown as FindOptionsWhere<T>
    const options: FindOneOptions<T> = { where, relations: relations ? this.getDefaultRelations() : undefined }
    return em ? await em.find(this.entityClass, { ...options, lock: { mode: 'pessimistic_write' } }) : await this.find(options)
  }

  @LogContextMethod()
  async findManyByName(nameList: string[], relations?: boolean, em?: EntityManager) {
    this.loggingService.debug('run')
    if (nameList.length <= 0) return []
    const where = { name: nameList.length === 1 ? nameList[0] : In(nameList) } as unknown as FindOptionsWhere<T>
    const options: FindOneOptions<T> = { where, relations: relations ? this.getDefaultRelations() : undefined }
    return em ? await em.find(this.entityClass, { ...options, lock: { mode: 'pessimistic_write' } }) : await this.find(options)
  }

  getDefaultRelations(): FindOptionsRelations<T> {
    return {}
  }

  @LogContextMethod()
  async findAll(findAllDTO: FindAllDTO, relations: boolean = false, em?: EntityManager) {
    this.loggingService.debug('run')
    const { limit: take = 10, page = 1, orderBy = 'createdAt', orderType = OrderTypeEnum.ASC, keyword } = findAllDTO
    const skip = (page - 1) * take
    const order = { [orderBy]: orderType, sort: OrderTypeEnum.ASC } as unknown as FindOptionsOrder<T>
    let where: FindOptionsWhere<T>[] | undefined
    if (keyword) where = this.buildKeywordWhere(keyword)
    const options: FindManyOptions<T> = { skip, take, order, where, relations: relations ? this.getDefaultRelations() : undefined }
    return em ? await em.findAndCount(this.entityClass, options) : await this.findAndCount(options)
  }

  buildKeywordWhere(keyword: string): FindOptionsWhere<T>[] {
    return [{ name: Like(`%${keyword}%`) }] as unknown as FindOptionsWhere<T>[]
  }

  @LogContextMethod()
  async existsById(idList: string[], em?: EntityManager) {
    this.loggingService.debug('run')
    if (idList.length <= 0) return false
    const where = { id: idList.length === 1 ? idList[0] : In(idList) } as unknown as FindOptionsWhere<T>
    return em ? await em.existsBy(this.entityClass, where) : await this.existsBy(where)
  }

  @LogContextMethod()
  async existsByName(nameList: string[], em?: EntityManager) {
    this.loggingService.debug('run')
    if (nameList.length <= 0) return false
    const where = { name: nameList.length === 1 ? nameList[0] : In(nameList) } as unknown as FindOptionsWhere<T>
    return em ? await em.existsBy(this.entityClass, where) : await this.existsBy(where)
  }
}
