import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { IntegrationTestService } from './support/integration-test.service'
import { datasource } from '../ormconfig'
import { AppModule } from '../src/app.module'

describe('e2e team tests', () => {
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

  async function getTeam(token, teamName) {
    const res = await request(app.getHttpServer())
      .get(`/teams/${teamName}`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
    return res
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

  it('should return team with 1 vote when voting for new team', async () => {
    await register('voter@user.com', 'password')
    const loginResponse = await login('voter@user.com', 'password')

    const token = loginResponse.body.accessToken
    const resVote = await request(app.getHttpServer())
      .put('/teams/newteam/vote')
      .set({ Authorization: `Bearer ${token}` })
      .send()

    expect(resVote.statusCode).toEqual(200)

    const res = await getTeam(token, 'new_team')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.objectContaining({
        name: 'newteam',
        voteCount: 1,
      }),
    )
  })

  it('should return team with actual votes when voting for existing team', async () => {
    await register('voter@user.com', 'password')
    const loginResponse = await login('voter@user.com', 'password')
    const token = loginResponse.body.accessToken

    const vote = async () => {
      await request(app.getHttpServer())
        .put('/teams/existing_team/vote')
        .set({ Authorization: `Bearer ${token}` })
        .send()
    }

    await vote()
    await vote()
    await vote()

    const res = await getTeam(token, 'existing_team')
    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual(
      expect.objectContaining({
        name: 'existing_team',
        voteCount: 3,
      }),
    )
  })
})
