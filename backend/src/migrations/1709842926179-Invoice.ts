/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Invoice1709842926179 implements MigrationInterface {
    public name = 'Invoice1709842926179';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "invoice" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "pdf" bytea, "order_id" character varying, CONSTRAINT "PK_6d0e5b1f3d5d3e3e4b3e1f6b7e3" PRIMARY KEY ("id"))');
        await queryRunner.query('ALTER TABLE "order" ADD "invoice_id" character varying');
        await queryRunner.query('ALTER TABLE "invoice" ADD CONSTRAINT "FK_63f3a7d2b2d4a7d4f3c3f1b4c8c" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "invoice" DROP CONSTRAINT "FK_63f3a7d2b2d4a7d4f3c3f1b4c8c"');
        await queryRunner.query('ALTER TABLE "order" DROP COLUMN "invoice_id"');
        await queryRunner.query('DROP TABLE "invoice"');
    }

}
