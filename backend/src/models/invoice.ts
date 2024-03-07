/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import {
    BeforeInsert,
    Column,
    Entity,
    OneToOne
} from 'typeorm';
import { BaseEntity } from '@medusajs/medusa';
import { generateEntityId } from '@medusajs/medusa/dist/utils';
import { Order } from './order';

@Entity()
export class Invoice extends BaseEntity {
    @Column({ type: 'bytea' })
    public pdf: Buffer | null;

    @Column({ type: 'varchar' })
    public order_id: string | null;

    @OneToOne(() => Order)
    public order: Order | null;

    @BeforeInsert()
    public beforeInsert(): void {
        this.id = generateEntityId(this.id, 'post');
    }

}
