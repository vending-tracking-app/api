import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNowhereWarehouse1767916403375 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "warehouse" ("type") VALUES ('nowhere')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "warehouse" WHERE "type" = 'nowhere'
    `);
  }
}
