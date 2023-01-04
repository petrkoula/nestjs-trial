import { DataSource, DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'

dotenv.config()

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [__dirname + '/src/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
}
export const datasource = new DataSource(config)
