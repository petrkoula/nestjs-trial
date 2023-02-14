import { DataSource } from 'typeorm'
import { User } from '../../src/modules/user/user.entity'

export class IntegrationTestService {
  constructor(private readonly datasource: DataSource) {}

  public async truncateTables(): Promise<void> {
    try {
      await this.init()

      const entities = this.datasource.entityMetadatas
      if (entities.length === 0) {
        return
      }

      const tableNames = entities
        .map((entity) => `"${entity.tableName}"`)
        .join(', ')

      await this.datasource.query(`truncate ${tableNames} cascade;`)
    } catch (error) {
      throw new Error(`Cleaning database failed - ${error}`)
    }
  }

  public async createTestUser(): Promise<User> {
    await this.init()

    const userRepo = this.datasource.getRepository(User)
    return await userRepo.save({
      email: 'test@test.user',
      name: 'test_user',
      password_hash: '___',
      created_at: new Date(),
    })
  }

  private async init() {
    if (!this.datasource.isInitialized) {
      await this.datasource.initialize()
    }
  }
}
