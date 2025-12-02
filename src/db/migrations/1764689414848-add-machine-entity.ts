import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMachineEntity1764689414848 implements MigrationInterface {
  name = 'AddMachineEntity1764689414848';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "machine" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "name" text NOT NULL,
                "location" text NOT NULL,
                CONSTRAINT "PK_acc588900ffa841d96eb5fd566c" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_c60541d21fe9d462cb49752d7d" ON "machine" ("name")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_c60541d21fe9d462cb49752d7d"
        `);
    await queryRunner.query(`
            DROP TABLE "machine"
        `);
  }
}
