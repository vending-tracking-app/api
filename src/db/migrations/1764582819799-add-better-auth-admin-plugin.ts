import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBetterAuthAdminPlugin1764582819799
  implements MigrationInterface
{
  name = 'AddBetterAuthAdminPlugin1764582819799';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "role" text NOT NULL DEFAULT 'user'
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "banned" boolean
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "banReason" text
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "banExpires" TIMESTAMP WITH TIME ZONE
        `);
    await queryRunner.query(`
            ALTER TABLE "session"
            ADD "impersonatedBy" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "session"
            ADD CONSTRAINT "FK_4a3c2e80be4ab9ea18777578e46" FOREIGN KEY ("impersonatedBy") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "session" DROP CONSTRAINT "FK_4a3c2e80be4ab9ea18777578e46"
        `);
    await queryRunner.query(`
            ALTER TABLE "session" DROP COLUMN "impersonatedBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "banExpires"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "banReason"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "banned"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "role"
        `);
  }
}
