import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRoleColumn1764441395202 implements MigrationInterface {
  name = 'AddUserRoleColumn1764441395202';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "role" text NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "role"
        `);
  }
}
