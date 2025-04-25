import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddShoppingItemTableAndRelationsMigration1744933847587
  implements MigrationInterface
{
  name = 'AddShoppingItemTableAndRelationsMigration1744933847587';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."shopping_item_quantity_type_enum" AS ENUM('grams', 'unit')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."shopping_item_status_enum" AS ENUM('todo', 'in_progress', 'completed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "shopping_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "quantity_type" "public"."shopping_item_quantity_type_enum" NOT NULL, "notes" character varying, "location" character varying NOT NULL, "status" "public"."shopping_item_status_enum" NOT NULL, "shopping_list_id" uuid NOT NULL, "product_id" uuid NOT NULL, "user_id" uuid, CONSTRAINT "PK_ba8be0884367f16abef13aa2af1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "shopping_item" ADD CONSTRAINT "FK_c0dcd11827aaf08da2427e0a2a4" FOREIGN KEY ("shopping_list_id") REFERENCES "shopping_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shopping_item" ADD CONSTRAINT "FK_9f3fb8eb078cc5ab59896f9d7ae" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shopping_item" ADD CONSTRAINT "FK_01d3ea230d037298dc37e311839" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shopping_item" DROP CONSTRAINT "FK_01d3ea230d037298dc37e311839"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shopping_item" DROP CONSTRAINT "FK_9f3fb8eb078cc5ab59896f9d7ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shopping_item" DROP CONSTRAINT "FK_c0dcd11827aaf08da2427e0a2a4"`,
    );
    await queryRunner.query(`DROP TABLE "shopping_item"`);
    await queryRunner.query(`DROP TYPE "public"."shopping_item_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."shopping_item_quantity_type_enum"`,
    );
  }
}
