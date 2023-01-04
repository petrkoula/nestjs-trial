import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventService } from './event.service'
import { CommonModule } from '../common/common.module'
import { Event } from './event.entity'
import { User } from '../user/user.entity'

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([Event])],
  exports: [EventService],
  providers: [EventService],
})
export class EventModule {}
