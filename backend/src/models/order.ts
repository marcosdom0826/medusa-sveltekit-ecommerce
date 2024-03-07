/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity, OneToOne } from 'typeorm';
import {
    Order as MedusaOrder
} from '@medusajs/medusa';
import { Invoice } from './invoice';

@Entity()
export class Order extends MedusaOrder {
    @Column({ type: 'varchar' })
    public invoice_id: string | null;

    @OneToOne(() => Invoice)
    public invoice: Invoice | null;
}
