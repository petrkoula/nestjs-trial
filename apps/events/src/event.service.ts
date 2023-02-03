import { Controller } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MessagePattern } from '@nestjs/microservices'
import { Event } from 'libs/shared/src/entities'
import { patterns } from '../../../libs/shared/src/message-patterns/patterns'
import { CreateEventDto, DeleteEventDto, FindOneEventDto, UpdateEventDto } from '../../../libs/shared/src/dto'

@Controller()
export class EventController {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {
  }

  @MessagePattern(patterns.findOne)
  async handleFindOne(dto: FindOneEventDto): Promise<Event> {
    return await this.eventRepository.findOneBy(dto.where)
  }

  @MessagePattern(patterns.list)
  async handleList(): Promise<Event[]> {
    return await this.eventRepository.find()
  }

  @MessagePattern(patterns.create)
  async handleCreate(dto: CreateEventDto): Promise<Event> {
    return await this.eventRepository.save({ user_id: dto.where.user_id, ...dto.event })
  }

  @MessagePattern(patterns.update)
  async handleUpdate(dto: UpdateEventDto): Promise<void> {
    await this.eventRepository.update(dto.where, dto.updateFields)
  }

  @MessagePattern(patterns.delete)
  async handleDelete(dto: DeleteEventDto): Promise<void> {
    await this.eventRepository.delete(dto.where)
  }
}
