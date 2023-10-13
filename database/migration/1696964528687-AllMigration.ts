import { MigrationInterface, QueryRunner } from "typeorm";

export class AllMigration1696964528687 implements MigrationInterface {
    name = 'AllMigration1696964528687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "card_number" character varying(10) NOT NULL, "balance" numeric NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "additional_info" text, "family_members" text NOT NULL DEFAULT '[]', CONSTRAINT "UQ_b48860677afe62cd96e12659482" UNIQUE ("email"), CONSTRAINT "UQ_911f907829a0e31e16a1d5c7803" UNIQUE ("card_number"), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "clients"`);
    }

}
