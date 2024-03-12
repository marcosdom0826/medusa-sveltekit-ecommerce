import { MigrationInterface, QueryRunner } from 'typeorm';

export class InvoiceNumber1709900013748 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "invoice" ADD "invoice_number" character varying');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "invoice" DROP COLUMN "invoice_number"');
    }

}
