import { AbstractNotificationService, FulfillmentService, Logger, Order, OrderService, ReturnedData } from '@medusajs/medusa';
import { EntityManager } from 'typeorm';
import nodemailer from 'nodemailer';


export default class EmailSenderService extends AbstractNotificationService {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static identifier = 'email-sender';
    protected manager: EntityManager;
    protected transactionManager: EntityManager;
    protected orderService: OrderService;
    protected fulfillmentService: FulfillmentService;
    protected logger: Logger;
    protected mailer: nodemailer.Transporter;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public constructor(container: Record<string, unknown>, options: Record<string, unknown>) {
        super(container);
        this.logger = container.logger as Logger;
        this.orderService = container.orderService as OrderService;
        this.fulfillmentService = container.fulfillmentService as FulfillmentService;

        this.mailer = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'bret3@ethereal.email',
                pass: 'X1aGzQSnRvT2gjNPbM'
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async sendNotification(event: string, data: Record<string, unknown>, attachmentGenerator: unknown): Promise<ReturnedData> {
        let order: Order;
        switch (event) {
            case 'order.placed': {
                if (!data.id) {
                    throw new Error('No order id');
                }
                order = await this.orderService.retrieve(data.id as string);
                return this.sendOrderEmail(order);
            }
            case 'order.shipment_created':
                if (!data.id) {
                    throw new Error('No order id');
                }
                order = await this.orderService.retrieve(data.id as string);
                return this.sendShippingEmail(order);
                break;
            default:
                break;

        }
        throw new Error('Received event not subscribed to');
    }
    public async resendNotification(
        notification: Record<string, unknown>,
        config: { to: string } | null | undefined,
        attachmentGenerator: unknown
    ): Promise<ReturnedData> {
        console.log('Resend notification', notification, config, attachmentGenerator);
        let order: Order;
        const data = notification.data as Record<string, unknown> & {
            orderId: string;
        };
        switch (notification.event_name) {
            case 'order.placed': {
                if (!data.orderId) {
                    throw new Error('No order id');
                }
                order = await this.orderService.retrieve(data.orderId, {
                    relations: ['fulfillments', 'fulfillments.tracking_links']
                });
                return this.sendOrderEmail(order, config?.to);
            }
            case 'order.shipment_created':
                if (!data.orderId) {
                    throw new Error('No order id');
                }
                order = await this.orderService.retrieve(data.orderId, {
                    relations: ['fulfillments', 'fulfillments.tracking_links']
                });
                return this.sendShippingEmail(order, config?.to);
            default:
                break;

        }
        throw new Error('Received event not subscribed to');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async sendOrderEmail(order: Order, to?: string): Promise<ReturnedData> {
        this.logger.info(`Sending order email ${JSON.stringify(order)}`);

        // ?email strips the layout and only returns the email body
        const page = await fetch(`${process.env.STORE_URL}/checkout/success/${order.id}?email=true`);
        const html = await page.text();

        const result = await this.mailer.sendMail({
            from: '"Fred Foo 👻" <bret3@ethereal.email>',
            to: to || order.email,
            subject: 'Order confirmation 📦',
            html: html
        });

        return {
            to: to || order.email,
            status: 'done',
            data: {
                orderId: order.id,
                mailerResult: result
            }
        };
    }

    protected async sendShippingEmail(order: Order, to?: string): Promise<ReturnedData> {
        this.logger.info(`Sending shipment email ${JSON.stringify(order)}`);


        const result = await this.mailer.sendMail({
            from: '"Fred Foo 👻" <bret3@ethereal.email>',
            to: to || order.email,
            subject: 'Your order has been shipped! 📦🚀🎉',
            text: 'Your order has been shipped!\n\n'
            + 'You can track your order here: ' + order.fulfillments[0].tracking_links[0].tracking_number + '\n\n'
        });

        return {
            to: to || order.email,
            status: 'done',
            data: {
                orderId: order.id,
                mailerResult: result
            }
        };
    }

}
