import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddShiftOperationEntity1767916487778
  implements MigrationInterface
{
  name = 'AddShiftOperationEntity1767916487778';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "shift_operation" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "type" text NOT NULL,
                "machineId" uuid NOT NULL,
                "createdById" uuid NOT NULL,
                "note" text,
                CONSTRAINT "PK_e57b32980e8245eb08f72525b00" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "stock_movement"
            ADD "shiftOperationId" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "shift_operation"
            ADD CONSTRAINT "FK_ebb13e9d9845257ff66b402b730" FOREIGN KEY ("machineId") REFERENCES "machine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "shift_operation"
            ADD CONSTRAINT "FK_eabe6f343e514c4fe467200fd35" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "stock_movement"
            ADD CONSTRAINT "FK_7ca5bab28065d3c2a50e58d4375" FOREIGN KEY ("shiftOperationId") REFERENCES "shift_operation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "stock_movement" DROP CONSTRAINT "FK_7ca5bab28065d3c2a50e58d4375"
        `);
    await queryRunner.query(`
            ALTER TABLE "shift_operation" DROP CONSTRAINT "FK_eabe6f343e514c4fe467200fd35"
        `);
    await queryRunner.query(`
            ALTER TABLE "shift_operation" DROP CONSTRAINT "FK_ebb13e9d9845257ff66b402b730"
        `);
    await queryRunner.query(`
            ALTER TABLE "stock_movement" DROP COLUMN "shiftOperationId"
        `);
    await queryRunner.query(`
            DROP TABLE "shift_operation"
        `);
  }
}
