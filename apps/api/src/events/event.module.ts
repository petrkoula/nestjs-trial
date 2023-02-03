import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventService } from './event.service'
import { CommonModule } from '../modules/common/common.module'
import { Event } from '../../../../libs/shared/src/entities'
import { AuthModule } from '../modules/auth/auth.module'
import { Repository } from 'typeorm'
import { ClientsModule, Transport } from '@nestjs/microservices'

const registerKafkaModule = () => ClientsModule.register([
  {
    name: 'EVENT_MICROSERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auth',
        brokers: ['localhost:9092'],
      },
      producerOnlyMode: true,
      consumer: {
        groupId: 'auth-consumer',
      },
    },
  },
])

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Event]),
    AuthModule,
    registerKafkaModule()],
  exports: [EventService, Repository<Event>],
  providers: [EventService, Repository<Event>],
})
export class EventModule {
}
