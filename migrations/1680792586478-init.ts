import { MigrationInterface, QueryRunner } from 'typeorm';

export default class init1680792586478 implements MigrationInterface {
  name = 'init1680792586478'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE "users_type_enum" AS ENUM(\'internal\', \'external\')');
    await queryRunner.query('CREATE TYPE "users_roles_enum" AS ENUM(\'admin\', \'moderator\', \'regular\', \'guest\')');
    await queryRunner.query('CREATE TYPE "users_language_enum" AS ENUM(\'en\', \'uk\', \'zh\')');
    await queryRunner.query(`--sql
        CREATE TABLE "users" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
          "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
          "email" character varying NOT NULL,
          "username" character varying NOT NULL,
          "password" character varying NOT NULL,
          "firstName" character varying(64) NOT NULL,
          "lastName" character varying(64) NOT NULL,
          "type" "users_type_enum" NOT NULL DEFAULT 'external',
          "roles" "users_roles_enum" array NOT NULL DEFAULT '{guest}',
          "phone" character varying,
          "isVerified" boolean NOT NULL DEFAULT false,
          "language" "users_language_enum" NOT NULL DEFAULT 'en',
            CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"
            PRIMARY KEY ("id"))`);
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") ');
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username") ');
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_a000cca60bcf04454e72769949" ON "users" ("phone") ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_a000cca60bcf04454e72769949"');
    await queryRunner.query('DROP INDEX "IDX_fe0bb3f6520ee0469504521e71"');
    await queryRunner.query('DROP INDEX "IDX_97672ac88f789774dd47f7c8be"');
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TYPE "users_language_enum"');
    await queryRunner.query('DROP TYPE "users_roles_enum"');
    await queryRunner.query('DROP TYPE "users_type_enum"');
  }
}
