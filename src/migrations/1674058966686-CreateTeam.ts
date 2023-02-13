import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTeam1674058966686 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "team" (
          id SERIAL PRIMARY KEY,
          name VARCHAR UNIQUE,
          vote_count INTEGER NULL,
          user_id INT NOT NULL,
          created_at timestamptz NOT NULL
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS team;`)
  }
}
