import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Event } from './event.entity'
import { UserContextService } from '../auth/user-context/user-context.service'

type EventFields = {
  from: Date
  till: Date
  title: string
  description?: string
}

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly userContextService: UserContextService,
  ) {
  }

  async findOne(id: number): Promise<Event> {
    const user = this.userContextService.getContext().user
    return await this.eventRepository.findOneBy({ user_id: user.id, id })
  }

  async list(): Promise<Event[]> {
    return await this.eventRepository.find()
  }

  async create(event: EventFields): Promise<Event> {
    const user = this.userContextService.getContext().user
    return await this.eventRepository.save({ user_id: user.id, ...event })
  }

  async update(id: number, updateFields: EventFields): Promise<void> {
    const user = this.userContextService.getContext().user
    await this.eventRepository.update({ id, user_id: user.id }, updateFields)
  }

  async delete(id: number): Promise<void> {
    const user = this.userContextService.getContext().user
    await this.eventRepository.delete({ id, user_id: user.id })
  }
}
