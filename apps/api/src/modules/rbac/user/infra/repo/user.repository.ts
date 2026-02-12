import type { FindOneOptions, FindOptionsWhere } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { EntityManager, In, Like } from 'typeorm'
import { LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra'
import { CrudRepositoryTemplate } from '@/common/template'
import { IUserRepository, UserEntity } from '../../domain'

/** 用户仓库实现 */
@Injectable()
@LogContextClass()
export class UserRepository extends CrudRepositoryTemplate<UserEntity> implements IUserRepository {
  constructor(
    protected readonly em: EntityManager,
    protected readonly loggingService: LoggingService,
  ) {
    super(UserEntity, em, loggingService)
  }

  buildKeywordWhere(keyword: string): FindOptionsWhere<UserEntity>[] {
    return [
      { name: Like(`%${keyword}%`) },
      { profile: { nickName: Like(`%${keyword}%`) } },
      { profile: { phone: Like(`%${keyword}%`) } },
      { profile: { email: Like(`%${keyword}%`) } },
    ]
  }

  async findManyByEmail(emailList: string[], relations?: boolean, em?: EntityManager) {
    this.loggingService.debug('run')
    if (emailList.length <= 0) return []
    const where: FindOptionsWhere<UserEntity> = { profile: { email: emailList.length === 1 ? emailList[0] : In(emailList) } }
    const options: FindOneOptions<UserEntity> = { where, relations: relations ? this.getDefaultRelations() : undefined }
    return em ? await em.find(UserEntity, { ...options, lock: { mode: 'pessimistic_write' } }) : await this.find(options)
  }

  async findManyByPhone(phoneList: string[], relations?: boolean, em?: EntityManager) {
    this.loggingService.debug('run')
    if (phoneList.length <= 0) return []
    const where: FindOptionsWhere<UserEntity> = { profile: { phone: phoneList.length === 1 ? phoneList[0] : In(phoneList) } }
    const options: FindOneOptions<UserEntity> = { where, relations: relations ? this.getDefaultRelations() : undefined }
    return em ? await em.find(UserEntity, { ...options, lock: { mode: 'pessimistic_write' } }) : await this.find(options)
  }

  async existsByEmail(emailList: string[], em?: EntityManager) {
    this.loggingService.debug('run')
    if (emailList.length <= 0) return false
    const where: FindOptionsWhere<UserEntity> = { profile: { email: emailList.length === 1 ? emailList[0] : In(emailList) } }
    return em ? await em.existsBy(UserEntity, where) : await this.existsBy(where)
  }

  async existsByPhone(phoneList: string[], em?: EntityManager) {
    this.loggingService.debug('run')
    if (phoneList.length <= 0) return false
    const where: FindOptionsWhere<UserEntity> = { profile: { phone: phoneList.length === 1 ? phoneList[0] : In(phoneList) } }
    return em ? await em.existsBy(UserEntity, where) : await this.existsBy(where)
  }
}
