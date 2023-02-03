import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common'
import { mapEventToDto } from './mappers'
import { EventService } from './event.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { AddEventPayload } from './addEvent.payload'
import { EventDto } from './event.dto'
import { toArray } from 'rxjs'

@Controller('events')
@ApiTags('events')
@ApiBearerAuth()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async list(): Promise<EventDto[]> {
    const events = this.eventService.list()
    let e = await events.pipe()
    return e
      .map(mapEventToDto)
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() payload: AddEventPayload): Promise<EventDto> {
    const event = await this.eventService.create(payload)
    return mapEventToDto(event)
  }

  @Put('/{id}')
  @UseGuards(AuthGuard())
  async update(
    @Query('id') id: number,
    @Body() payload: AddEventPayload,
  ): Promise<EventDto> {
    const event = await this.eventService.update(id, payload)
    return mapEventToDto(event)
  }

  @Delete('/{id}')
  @UseGuards(AuthGuard())
  async delete(@Query('id') id: number): Promise<void> {
    await this.eventService.delete(id)
  }
}
