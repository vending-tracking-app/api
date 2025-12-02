import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductEntity1764688644514 implements MigrationInterface {
  name = 'AddProductEntity1764688644514';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "product" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "sku" text NOT NULL,
                "name" text NOT NULL,
                CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_34f6ca1cd897cc926bdcca1ca3" ON "product" ("sku")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_34f6ca1cd897cc926bdcca1ca3"
        `);
    await queryRunner.query(`
            DROP TABLE "product"
        `);
  }
}
