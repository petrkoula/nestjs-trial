import { Test, TestingModule } from '@nestjs/testing'
import { EventService } from '../../../src/modules/event/event.service'
import { datasource } from '../../../ormconfig'
import { IntegrationTestService } from './integration-test.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Event } from '../../../src/modules/event/event.entity'
import { EventModule } from '../../../src/modules/event/event.module'
import { databaseFactory } from '../../../src/app.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'

describe(EventService, () => {
  let dbService
  let module: TestingModule

  const orm = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: databaseFactory,
  })

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [EventModule, orm, TypeOrmModule.forFeature([Event])],
      providers: [EventService],
    }).compile()

    dbService = new IntegrationTestService(datasource)
  })

  beforeEach(async () => {
    //await dbService.truncateTables()
  })

  it('creates event', async () => {
    const eventService = await module.resolve(EventService)

    const { id } = await eventService.create(2, {
      from: new Date('2022-01-01'),
      till: new Date('2022-01-01'),
      title: 'title',
      description: 'description',
    })

    const event = await eventService.findOne(2, id)

    expect(event).toEqual(expect.objectContaining({
      id,
      from: new Date('2022-01-01'),
      till: new Date('2022-01-01'),
      title: 'title',
      description: 'description',
      user_id: 2,
    }))
  })
})
