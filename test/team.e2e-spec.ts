import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { IntegrationTestService } from './support/integration-test.service'
import { datasource } from '../ormconfig'
import { AppModule } from '../src/app.module'
import { login, register, requestAs } from './support/requests'

describe('e2e team tests', () => {
  let app: INestApplication
  let dbService

  async function getTeam(token, teamName) {
    return request(app.getHttpServer())
      .get(`/teams/${teamName}`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
  }

  async function getLeaderboard() {
    return request(app.getHttpServer()).get(`/public/leaderboard`).send()
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
    await register(app)('voter@user.com', 'password')
    const loginResponse = await login(app)('voter@user.com', 'password')

    const token = loginResponse.body.accessToken
    const resVote = await request(app.getHttpServer())
      .put('/teams/newteam/vote')
      .set({ Authorization: `Bearer ${token}` })
      .send()

    expect(resVote.statusCode).toEqual(200)

    const res = await getTeam(token, 'newteam')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.objectContaining({
        name: 'newteam',
        voteCount: 1,
      }),
    )
  })

  it('should return team with actual votes when voting for existing team', async () => {
    await register(app)('voter@user.com', 'password')
    const loginResponse = await login(app)('voter@user.com', 'password')
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

  it('should return leaderboard with teams ordered by votes descending', async () => {
    const user1 = 'voter@user.com'
    const user2 = 'lady@bug.eu'
    const pass = 'password'
    await register(app)(user1, pass)
    await register(app)(user2, pass)

    const voteForWinners = () =>
      requestAs(app)(user1, pass, (req) =>
        req.put('/teams/winners/vote').send(),
      )
    const voteForLoosers = () =>
      requestAs(app)(user2, pass, (req) =>
        req.put('/teams/loosers/vote').send(),
      )

    await voteForWinners()
    await voteForWinners()
    await voteForWinners()

    await voteForLoosers()

    const res = await getLeaderboard()
    expect(res.statusCode).toEqual(200)

    expect(res.body[0]).toEqual(
      expect.objectContaining({ name: 'winners', voteCount: 3 }),
    )
    expect(res.body[1]).toEqual(
      expect.objectContaining({ name: 'loosers', voteCount: 1 }),
    )
  })
})
