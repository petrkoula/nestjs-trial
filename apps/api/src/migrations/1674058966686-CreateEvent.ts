import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateEvent1674058966686 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "event" (
          id SERIAL PRIMARY KEY,
          "from" timestamptz NOT NULL,
          till timestamptz NOT NULL,
          title VARCHAR NOT NULL,
          description VARCHAR NULL,
          user_id INT NOT NULL,
          created_at timestamptz NOT NULL
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS event;`)
  }
}
