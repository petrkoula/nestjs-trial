import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { UserContextService } from '../modules/auth/user-context/user-context.service'
import { Observable } from 'rxjs'
import { patterns } from '../../../../libs/shared/src/message-patterns/patterns'
import {
  CreateEventDto,
  DeleteEventDto,
  EventFields,
  FindOneEventDto,
  UpdateEventDto,
} from '../../../../libs/shared/src/dto'
import { Event } from '../../../../libs/shared/src/entities'

@Injectable()
export class EventService implements OnModuleInit {
  constructor(
    private readonly userContextService: UserContextService,
    @Inject('EVENTS_MICROSERVICE')
    private readonly eventsClient: ClientKafka,
  ) {
  }

  findOne(id: number): Observable<Event> {
    const user = this.userContextService.getContext().user

    const dto: FindOneEventDto = { where: { user_id: user.id, id } }
    return this.eventsClient.send<Event>(patterns.findOne, dto)
  }

  list(): Observable<Event[]> {
    return this.eventsClient.send<Event[]>(patterns.list, {})
  }

  create(event: EventFields): Observable<Event[]> {
    const user = this.userContextService.getContext().user

    const dto: CreateEventDto = { where: { user_id: user.id }, event }
    return this.eventsClient.send<Event[]>(patterns.create, dto)
  }

  update(id: number, updateFields: EventFields): Observable<Event> {
    const user = this.userContextService.getContext().user

    const dto: UpdateEventDto = { where: { id, user_id: user.id }, updateFields }
    return this.eventsClient.send<Event>(patterns.update, dto)
  }

  delete(id: number): Observable<Event> {
    const user = this.userContextService.getContext().user

    const dto: DeleteEventDto = { where: { id, user_id: user.id } }
    return this.eventsClient.send<Event>(patterns.delete, dto)
  }

  async onModuleInit() {
    this.eventsClient.subscribeToResponseOf(patterns.findOne)
    this.eventsClient.subscribeToResponseOf(patterns.list)
    this.eventsClient.subscribeToResponseOf(patterns.create)
    this.eventsClient.subscribeToResponseOf(patterns.update)
    this.eventsClient.subscribeToResponseOf(patterns.delete)
    await this.eventsClient.connect()
  }
}
