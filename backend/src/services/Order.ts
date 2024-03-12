/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { Cart, OrderService as MedusaOrderService, Order as MedusaOrder, FindConfig } from '@medusajs/medusa';
import { Invoice } from '../models/invoice';
import { Order } from '../models/order';
import pdfmake from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { DateTime } from 'luxon';
// eslint-disable-next-line @typescript-eslint/naming-convention
import PdfPrinter from 'pdfmake';
import { MoreThanOrEqual } from 'typeorm';


const FONTS = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
} as const;

export default class OrderService extends MedusaOrderService {
    protected printer: PdfPrinter;

    public constructor(deps) {
        super(deps);
        this.printer = new pdfmake(FONTS);
    }
    public override async retrieve(orderId: string, config?: FindConfig<MedusaOrder>): Promise<MedusaOrder> {
        config = {
            ...(config || {}),
            relations: [
                ...(config?.relations || []),
                'invoice'
            ]
        };
        const result = await super.retrieve(orderId, config);
        result.metadata = {
            ...(result.metadata),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            invoice: (result as any).invoice
        };
        return result;
    }

    public override async createFromCart(cartOrId: string | Cart): Promise<Order | MedusaOrder | never> {
        const originalResult = await super.createFromCart(cartOrId) as Order;

        const invoiceRepo = this.activeManager_.getRepository(Invoice);
        const orderRepo = this.activeManager_.getRepository(Order);

        const joinedOrder = await this.retrieveWithTotals(originalResult.id, {
            relations: [
                'cart',
                'cart.items',
                'cart.items.variant',
                'cart.customer',
                'cart.billing_address',
                'shipping_address',
                'cart.payment',
                'items',
                'items.variant'
            ]
        }) as Order;

        const paymentProvider = joinedOrder.cart.payment_session
         || joinedOrder.cart.payment?.provider_id
         || joinedOrder.cart.payment_session?.provider_id;
        if (paymentProvider === 'system' && process.env.SYSTEM_INVOICE === 'false') {
            return originalResult;
        }


        const invoiceCountInMonth = (await invoiceRepo.countBy({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            created_at: MoreThanOrEqual(DateTime.now().startOf('month').toJSDate())
        })) + 1;

        const invoice = new Invoice();
        const invoiceNumber = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${invoiceCountInMonth.toString().padStart(6, '0')}`;
        invoice.invoice_number = invoiceNumber;
        invoice.pdf = await this.createInvoicePdf(joinedOrder, invoiceNumber);
        invoice.order = originalResult;
        invoice.order_id = originalResult.id;
        await invoiceRepo.save(invoice);
        originalResult.invoice = invoice;
        originalResult.invoice_id = invoice.id;
        await orderRepo.save(originalResult);

        return originalResult;
    }

    protected async createInvoicePdf(order: Order, invoiceNumber: string): Promise<Buffer> {
        return new Promise((resolve) => {
            const dd = this.generateDocumentDefinition(order, invoiceNumber);
            const invoice = this.printer.createPdfKitDocument(dd);
            const buffers = [];
            invoice.on('data', buffers.push.bind(buffers));
            invoice.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            invoice.end();
        });
    }


    protected generateDocumentDefinition(order: Order, invoiceNumber: string): TDocumentDefinitions {
        const deliveryAddress = {
            name: order.shipping_address.first_name + ' ' + order.shipping_address.last_name,
            address: order.shipping_address.address_1,
            city: order.shipping_address.postal_code + ' ' + order.shipping_address.city,
            ...( order.shipping_address.company ? { company: order.shipping_address.company } : {})
        };
        const invoiceAddress = {
            name: order.billing_address ? order.billing_address.first_name + ' ' + order.billing_address.last_name : deliveryAddress.name,
            address: order.billing_address ? order.billing_address.address_1 : deliveryAddress.address,
            city: order.billing_address ? order.billing_address.postal_code + ' ' + order.billing_address.city : deliveryAddress.city,
            ...( order.billing_address && order.billing_address.company ? { company: order.billing_address.company } :
                order.shipping_address?.company ? { company: order.shipping_address.company } : {})
        };
        const paymentProvider = order.cart.payment_session?.provider_id ||  order.cart.payment?.provider_id || 'Not available';
        const paymentOption = (paymentProvider === 'paypal'
            ? 'Paypal'
            : ( paymentProvider === 'system'
                ? 'System'
                : 'Manual'
            )
        );
        return {
            pageSize: 'A4',
            content: [
                {
                    columns: [
                        {
                            text: 'Invoice',
                            style: 'header'
                        },
                        {
                            text: 'LOGO',
                            style: 'logo'
                        }
                    ]
                },
                {
                    table: {
                        body: [
                            [
                                { text: 'Invoice Address', style: 'smaller' },
                                '',
                                { text: 'Delivery Address', style: 'smaller' }],
                            [
                                { stack: [
                                    invoiceAddress.name,
                                    ...( invoiceAddress.company ? [invoiceAddress.company] : []),
                                    invoiceAddress.address,
                                    invoiceAddress.city
                                ] },
                                '',
                                { stack:[
                                    deliveryAddress.name,
                                    ...(deliveryAddress.company ? [deliveryAddress.company] : []),
                                    deliveryAddress.address,
                                    deliveryAddress.city
                                ] }
                            ]
                        ],
                        widths: ['auto', 50, 'auto']
                    },
                    layout: 'noBorders',
                    margin: [0, 10]
                },
                {
                    table: {
                        body: [
                            [
                                { text: 'Invoice date', style: 'med', margin: [0, 5, 0, 0] },
                                { text: 'Invoice number', style: 'med', margin: [0, 5, 0, 0] },
                                { text: 'Delivery option', style: 'med', margin: [0, 5, 0, 0] },
                                { text: 'Payment option', style: 'med', margin: [0, 5, 0, 0] }
                            ],
                            [
                                { text: DateTime.now().setLocale('de').toLocaleString(DateTime.DATE_SHORT), margin: [0, 0, 0, 5] },
                                { text: invoiceNumber, margin: [0, 0, 0, 5] },
                                { text: 'DHL', margin: [0, 0, 0, 5] },
                                { text: paymentOption, margin: [0, 0, 0, 5] }
                            ]
                        ],
                        widths: ['*', '*', '*', '*']
                    },
                    layout: {
                        vLineWidth: () => 0,
                        hLineWidth: (i) => (i === 0 || i === 2) ? 2 : 0
                    },
                    margin: [0, 20, 0, 10]
                },
                {
                    text: 'blablabla\n\nmoreblabla\nthanks for your order\nblablabla',
                    style: 'smaller',
                    margin: [0, 10]
                },
                {
                    table: {
                        body: [
                            ['Position', 'Article', 'Count', 'Unit price', 'Unit total'],

                            ...order.items.map((item, idx) => [
                                {
                                    text: idx + 1,
                                    alignment: 'center'
                                },
                                {
                                    text: `${item.title}\n${item.variant.title}`
                                },
                                {
                                    text: item.quantity,
                                    alignment: 'center'
                                },
                                {
                                    text: `${item.unit_price / 100} €`,
                                    alignment: 'center'
                                },
                                {
                                    text: `${item.unit_price * item.quantity / 100} €`,
                                    alignment: 'center'
                                }
                            ])
                        ],
                        widths: ['auto', '*', 'auto', 'auto', 'auto']
                    },
                    layout: {
                        hLineWidth: (i) => i === 1 ? 2 : 1,
                        hLineColor:  (i, node) =>(i === 0 || i === node.table.body.length || i === 1) ? 'black' : 'gray',
                        vLineColor: (i, node) => (i === 0 || i === node.table.widths.length) ? 'black' : 'gray'
                    }
                },
                {
                    table: {
                        body: [
                            [
                                { text: '', border: [false, false, false, false] },
                                { text: 'Subtotal', alignment: 'right' },
                                { text: `${order.subtotal / 100} €`, alignment: 'right' }],
                            [
                                { text: '', border: [false, false, false, false] },
                                { text: 'Shipping', alignment: 'right' },
                                {
                                    text: order.shipping_total ? `${order.shipping_total / 100} €` : 'Free',
                                    alignment: 'right'
                                }
                            ],
                            [
                                { text: '', border: [false, false, false, false] },
                                { text: 'Total', alignment: 'right', style: 'bold' },
                                { text: `${order.total / 100} €`, alignment: 'right', style: 'bold' }
                            ]
                        ],
                        widths: ['*', 'auto', 'auto']
                    },
                    unbreakable: true,
                    layout: {
                        vLineWidth: () => 0,
                        hLineWidth: (i, node) => i === node.table.body.length - 1 ? 1 : 0
                    },
                    margin: [0, 10]
                }
            ],
            footer: (currentPage, pageCount) => ({
                columns: [
                    {
                        text: 'This is a computer generated invoice. No signature is required.',
                        style: 'small'
                    },
                    {
                        text: `${currentPage} of ${pageCount}`,
                        alignment: 'right'
                    }
                ],
                margin: [40, 0]
            }),
            styles: {
                header: {
                    fontSize: 18,
                    bold: true
                },
                logo: {
                    alignment: 'right'
                },
                bold: {
                    bold: true
                },
                subheader: {
                    fontSize: 15,
                    bold: true
                },
                quote: {
                    italics: true
                },
                small: {
                    fontSize: 8
                },
                smaller: {
                    fontSize: 10
                },
                med: {
                    fontSize: 11
                }
            }
        };
    }

}
