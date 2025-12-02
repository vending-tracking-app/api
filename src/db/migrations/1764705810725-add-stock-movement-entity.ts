import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStockMovementEntity1764705810725 implements MigrationInterface {
  name = 'AddStockMovementEntity1764705810725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "stock_movement_item" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "movementId" uuid NOT NULL,
                "productId" uuid NOT NULL,
                "quantity" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_2222849c36f2c923a4fdd19b1a8" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "stock_movement" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "fromWarehouseId" uuid NOT NULL,
                "toWarehouseId" uuid NOT NULL,
                "type" text NOT NULL,
                "createdById" uuid NOT NULL,
                "note" text,
                CONSTRAINT "PK_9fe1232f916686ae8cf00294749" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "stock_movement_item"
            ADD CONSTRAINT "FK_5e523cca5d037ba68a40564c105" FOREIGN KEY ("movementId") REFERENCES "stock_movement"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "stock_movement_item"
            ADD CONSTRAINT "FK_eccc1ab89430968559940f17ee2" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "stock_movement"
            ADD CONSTRAINT "FK_990ec911c67bd2e37af71cc4b97" FOREIGN KEY ("fromWarehouseId") REFERENCES "warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "stock_movement"
            ADD CONSTRAINT "FK_ad450abd41f9b4775777a58dd93" FOREIGN KEY ("toWarehouseId") REFERENCES "warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "stock_movement"
            ADD CONSTRAINT "FK_27ea7c4375b62927e6136465c4c" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "stock_movement" DROP CONSTRAINT "FK_27ea7c4375b62927e6136465c4c"
        `);
    await queryRunner.query(`
            ALTER TABLE "stock_movement" DROP CONSTRAINT "FK_ad450abd41f9b4775777a58dd93"
        `);
    await queryRunner.query(`
            ALTER TABLE "stock_movement" DROP CONSTRAINT "FK_990ec911c67bd2e37af71cc4b97"
        `);
    await queryRunner.query(`
            ALTER TABLE "stock_movement_item" DROP CONSTRAINT "FK_eccc1ab89430968559940f17ee2"
        `);
    await queryRunner.query(`
            ALTER TABLE "stock_movement_item" DROP CONSTRAINT "FK_5e523cca5d037ba68a40564c105"
        `);
    await queryRunner.query(`
            DROP TABLE "stock_movement"
        `);
    await queryRunner.query(`
            DROP TABLE "stock_movement_item"
        `);
  }
}
