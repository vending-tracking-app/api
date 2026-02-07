import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhoneNumberFields1770472981226 implements MigrationInterface {
  name = 'AddPhoneNumberFields1770472981226';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "phoneNumber" text
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "phoneNumberVerified" boolean
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_f2578043e491921209f5dadd08" ON "user" ("phoneNumber")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_f2578043e491921209f5dadd08"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "phoneNumberVerified"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "phoneNumber"
        `);
  }
}
