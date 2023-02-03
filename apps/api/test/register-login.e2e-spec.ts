import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { IntegrationTestService } from './modules/event/integration-test.service'
import { datasource } from '../ormconfig'

describe('e2e tests', () => {
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

  it('registered user can login', async () => {
    const res = await register('test@user.com', 'password')
    expect(res.statusCode).toEqual(201)

    const loginResponse = await login('test@user.com', 'password')
    expect(loginResponse.statusCode).toEqual(201)
    expect(loginResponse.body).toEqual({
      accessToken: expect.stringContaining('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'),
      expiresIn: 3600,
    })
  })

  it('cannot register already registered user', async () => {
    await register('test@user.com', 'password')

    const resRepeated = await register('test@user.com', 'password')
    expect(resRepeated.statusCode).toEqual(409)
  })

  it('login fails with bad password', async () => {
    await register('registered@user.com', '1234567890')

    const res = await login('registered@user.com', 'bad_password')

    expect(res.statusCode).toEqual(401)
  })

  it('login fails with unknown email', async () => {
    const res = await login('unknown@dot.com', '_____')

    expect(res.statusCode).toEqual(401)
  })
})
