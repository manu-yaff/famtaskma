import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddShoppingListTableAndRelationWithUserMigration1744672644828
  implements MigrationInterface
{
  name = 'AddShoppingListTableAndRelationWithUserMigration1744672644828';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "shopping_list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_87d9431f2ea573a79370742b474" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "shoping_lists_users" ("shopping_list_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_bfaa5426a4d4c994fdd69eaf832" PRIMARY KEY ("shopping_list_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e818710198c6b68c7852cef05c" ON "shoping_lists_users" ("shopping_list_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3c16fa944c1acd72380c4200d1" ON "shoping_lists_users" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "shoping_lists_users" ADD CONSTRAINT "FK_e818710198c6b68c7852cef05c5" FOREIGN KEY ("shopping_list_id") REFERENCES "shopping_list"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "shoping_lists_users" ADD CONSTRAINT "FK_3c16fa944c1acd72380c4200d10" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shoping_lists_users" DROP CONSTRAINT "FK_3c16fa944c1acd72380c4200d10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shoping_lists_users" DROP CONSTRAINT "FK_e818710198c6b68c7852cef05c5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3c16fa944c1acd72380c4200d1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e818710198c6b68c7852cef05c"`,
    );
    await queryRunner.query(`DROP TABLE "shoping_lists_users"`);
    await queryRunner.query(`DROP TABLE "shopping_list"`);
  }
}
