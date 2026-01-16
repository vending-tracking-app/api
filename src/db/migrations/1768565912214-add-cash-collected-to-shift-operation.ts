import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCashCollectedToShiftOperation1768565912214
  implements MigrationInterface
{
  name = 'AddCashCollectedToShiftOperation1768565912214';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "shift_operation"
            ADD "cashCollected" integer
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "shift_operation" DROP COLUMN "cashCollected"
        `);
  }
}
