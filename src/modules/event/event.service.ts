import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Event } from './event.entity'

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
  ) {
  }

  async findOne(userId: number, id: number): Promise<Event> {
    return await this.eventRepository.findOneBy({ user_id: userId, id })
  }

  async list(userId: number): Promise<Event[]> {
    return await this.eventRepository.find()
  }

  async create(userId: number, event: EventFields): Promise<Event> {
    return await this.eventRepository.save({ user_id: userId, ...event })
  }

  async update(userId: number, id: number, updateFields: EventFields): Promise<void> {
    await this.eventRepository.update({ id, user_id: userId }, updateFields)
  }

  async delete(userId: number, id: number): Promise<void> {
    await this.eventRepository.delete({ id, user_id: userId })
  }
}
