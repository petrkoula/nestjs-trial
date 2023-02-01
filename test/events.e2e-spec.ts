import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { IntegrationTestService } from './modules/event/integration-test.service'
import { datasource } from '../ormconfig'
import { AddEventPayload } from '../src/modules/event/event.controller'

describe('events e2e tests', () => {
  let app: INestApplication
  let dbService

  async function register(email: string, password: string) {
    return request(app.getHttpServer()).post('/auth/register').send({
      email,
      name: 'Test User',
      password,
    })
  }

  async function login(email: string, password: string) {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
  }

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    dbService = new IntegrationTestService(datasource)

    app = module.createNestApplication()
    await app.init()
  })

  beforeEach(async () => {
    await dbService.truncateTables()
  })

  it('can post new event', async () => {
    const res = await register('test3@user.com', 'password')
    expect(res.statusCode).toEqual(201)

    const loginResponse = await login('test3@user.com', 'password')
    expect(loginResponse.statusCode).toEqual(201)

    const body: AddEventPayload = {
      from: new Date('2020-10-10'),
      till: new Date('2020-10-10'),
      description: 'desc',
      title: 'title',
    }
    const token = loginResponse.body.accessToken
    const resEvent = await request(app.getHttpServer())
      .post('/events')
      .set({ Authorization: `Bearer ${token}` })
      .send(body)

    expect(resEvent.statusCode).toEqual(201)
  })
})
