import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUser1672674189462 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" (
          id SERIAL PRIMARY KEY,
          email VARCHAR NOT NULL,
          name VARCHAR NOT NULL,
          password_hash VARCHAR NOT NULL,
          created_at timestamptz NOT NULL
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS user;`)
  }
}
