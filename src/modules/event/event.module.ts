import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventService } from './event.service'
import { CommonModule } from '../common/common.module'
import { Event } from './event.entity'
import { AuthModule } from '../auth/auth.module'
import { Repository } from 'typeorm'

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([Event]), AuthModule],
  exports: [EventService, Repository<Event>],
  providers: [EventService, Repository<Event>],
})
export class EventModule {}
