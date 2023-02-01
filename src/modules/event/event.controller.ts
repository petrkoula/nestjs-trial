import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common'
import { IsNotEmpty } from 'class-validator'
import { mapEventToDto } from './mappers'
import { EventService } from './event.service'
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

export class AddEventPayload {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  from: Date

  @ApiProperty({ required: true })
  @IsNotEmpty()
  till: Date

  @ApiProperty({ required: true })
  @IsNotEmpty()
  title: string
  description?: string
}

export class EventDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  id: Date

  @ApiProperty({ required: true })
  @IsNotEmpty()
  from: Date

  @ApiProperty({ required: true })
  @IsNotEmpty()
  till: Date

  @ApiProperty({ required: true })
  @IsNotEmpty()
  title: string

  @ApiProperty({ required: true })
  description: string
}

@Controller('events')
@ApiTags('events')
@ApiBearerAuth()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async list(): Promise<EventDto[]> {
    const events = await this.eventService.list()
    return events.map(mapEventToDto)
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
