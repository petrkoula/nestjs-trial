import { DataSource } from 'typeorm'
import { datasource } from '../../../ormconfig'

export class IntegrationTestService {
  constructor(private readonly datasource: DataSource) {
  }

  public async truncateTables(): Promise<void> {
    try {
      if (!datasource.isInitialized) {
        await datasource.initialize()
      }

      const entities = this.datasource.entityMetadatas
      if(entities.length === 0){
        return
      }

      const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(', ')

      await this.datasource.query(`truncate ${tableNames} cascade;`)
    } catch (error) {
      throw new Error(`Cleaning database failed - ${error}`)
    }
  }
}
