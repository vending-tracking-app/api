import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWarehouseEntity1764695803005 implements MigrationInterface {
  name = 'AddWarehouseEntity1764695803005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "warehouse_product" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "warehouseId" uuid NOT NULL,
                "productId" uuid NOT NULL,
                "quantity" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_327c519be4aeb4ddabc14e595ca" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_39d434ac784c5ced01ab6327a1" ON "warehouse_product" ("warehouseId", "productId")
        `);
    await queryRunner.query(`
            CREATE TABLE "warehouse" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "type" text NOT NULL,
                "userId" uuid,
                "machineId" uuid,
                CONSTRAINT "REL_d2bab02e8eea1680e8e372b51d" UNIQUE ("userId"),
                CONSTRAINT "REL_fc57488b8a2225120267a353df" UNIQUE ("machineId"),
                CONSTRAINT "PK_965abf9f99ae8c5983ae74ebde8" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "warehouse_product"
            ADD CONSTRAINT "FK_a8c9aee14d47ec7b3f2ac429ebc" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "warehouse_product"
            ADD CONSTRAINT "FK_3f934c4772e7c7f2c66d7ea4e72" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "warehouse"
            ADD CONSTRAINT "FK_d2bab02e8eea1680e8e372b51d8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "warehouse"
            ADD CONSTRAINT "FK_fc57488b8a2225120267a353df4" FOREIGN KEY ("machineId") REFERENCES "machine"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "warehouse" DROP CONSTRAINT "FK_fc57488b8a2225120267a353df4"
        `);
    await queryRunner.query(`
            ALTER TABLE "warehouse" DROP CONSTRAINT "FK_d2bab02e8eea1680e8e372b51d8"
        `);
    await queryRunner.query(`
            ALTER TABLE "warehouse_product" DROP CONSTRAINT "FK_3f934c4772e7c7f2c66d7ea4e72"
        `);
    await queryRunner.query(`
            ALTER TABLE "warehouse_product" DROP CONSTRAINT "FK_a8c9aee14d47ec7b3f2ac429ebc"
        `);
    await queryRunner.query(`
            DROP TABLE "warehouse"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_39d434ac784c5ced01ab6327a1"
        `);
    await queryRunner.query(`
            DROP TABLE "warehouse_product"
        `);
  }
}
