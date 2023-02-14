import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import { TeamModule } from '../../../src/modules/team/team.module'
import { Team } from '../../../src/modules/team/team.entity'
import { TeamService } from '../../../src/modules/team/team.service'
import { IntegrationTestService } from '../../support/integration-test.service'
import { databaseFactory } from '../../../src/app.module'
import { datasource } from '../../../ormconfig'
import { UserContextService } from '../../../src/modules/auth/user-context/user-context.service'

describe(TeamService, () => {
  let dbService
  let module: TestingModule

  const orm = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: databaseFactory,
  })

  beforeAll(async () => {
    dbService = new IntegrationTestService(datasource)
    const testUser = await dbService.createTestUser()

    const userContextService = {
      getContext: () => ({ user: { id: testUser.id, email: '', name: '' } }),
    }
    module = await Test.createTestingModule({
      imports: [TeamModule, orm],
    })
      .overrideProvider(UserContextService)
      .useValue(userContextService)
      .compile()
  })

  afterAll(async () => {
    await dbService.truncateTables()
  })

  it('creates new team when voting for the first time', async () => {
    const teamService = await module.resolve(TeamService)

    await teamService.createOrIncrementByName('New Team')
    const team = await teamService.findOneByName('New Team')

    expect(team.name).toEqual('New Team')
    expect(team.voteCount).toEqual(1)
  })

  it('increments votes for existing team', async () => {
    const teamService = await module.resolve(TeamService)

    await teamService.createOrIncrementByName('Existing Guys')
    await teamService.createOrIncrementByName('Existing Guys')

    const team = await teamService.findOneByName('Existing Guys')
    expect(team.voteCount).toEqual(2)
  })
})
