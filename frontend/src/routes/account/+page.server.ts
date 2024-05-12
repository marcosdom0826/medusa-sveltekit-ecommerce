import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { AxiosError } from 'axios';
import { medusa } from '$/lib/medusa';

export const load: PageServerLoad = async ({ parent }) => {
    const authToken = (await parent()).authToken;
    if (!authToken) {
        throw redirect(302, '/account/login');
    }

};

export const actions = {
    editDetails: async ( event ) => {
        const authToken = event.cookies.get('auth_token');
        const data = await event.request.formData();

        try {
            await medusa.customers.update({
                first_name: data.get('first_name') as string || undefined,
                last_name: data.get('last_name') as string || undefined,
                email: data.get('email') as string || undefined,
                phone: data.get('phone') as string || undefined
            }, {
                Authorization: `Bearer ${authToken}`
            });
        } catch (e) {
            console.error(e);
            if ((e as AxiosError)?.response?.data) {
                return fail(400, { error: (e as AxiosError).response?.data as Record<string, unknown> });
            }
            return fail(400, { error: e as Record<string, unknown> });
        }
    },
    editAddresses: async (event) => {
        const authToken = event.cookies.get('auth_token');
        const data = await event.request.formData();
        try {
            const customer = (await medusa.customers.retrieve({
                Authorization: `Bearer ${authToken}`
            })).customer;

            if ((customer.shipping_addresses || []).length === 0) {
                await medusa.customers.addresses.addAddress({
                    address: {
                        first_name: data.get('shipping_first_name') as string,
                        last_name: data.get('shipping_last_name') as string,
                        company: data.get('shipping_company') as string || '',
                        address_1: data.get('shipping_address_1') as string,
                        address_2: '',
                        city: data.get('shipping_city') as string,
                        postal_code: data.get('shipping_postal_code') as string,
                        phone: '',
                        province: '',
                        metadata: {},
                        country_code: data.get('shipping_country') as string
                    }
                }, {
                    Authorization: `Bearer ${authToken}`
                });
            } else {
                await medusa.customers.addresses.updateAddress(customer.shipping_addresses[0].id, {
                    first_name: data.get('shipping_first_name') as string || undefined,
                    last_name: data.get('shipping_last_name') as string|| undefined,
                    company: data.get('shipping_company') as string || '',
                    address_1: data.get('shipping_address_1') as string || undefined,
                    city: data.get('shipping_city') as string || undefined,
                    postal_code: data.get('shipping_postal_code') as string || undefined,
                    country_code: data.get('shipping_country') as string || undefined
                }, {
                    Authorization: `Bearer ${authToken}`
                });
            }

            if (data.get('separateInvoiceAddress')) {
                await medusa.customers.update({
                    billing_address: {
                        first_name: data.get('invoice_first_name') as string || undefined,
                        last_name: data.get('invoice_last_name') as string || undefined,
                        company: data.get('invoice_company') as string || '',
                        address_1: data.get('invoice_address_1') as string || undefined,
                        address_2: '',
                        city: data.get('invoice_city') as string || undefined,
                        postal_code: data.get('invoice_postal_code') as string || undefined,
                        phone: '',
                        province: '',
                        metadata: {},
                        country_code: data.get('invoice_country') as string || undefined
                    }
                }, {
                    Authorization: `Bearer ${authToken}`
                });
            } else {
                if (customer.billing_address?.address_1) {
                    await medusa.customers.update({
                        billing_address: {
                            address_1: ''
                        }
                    }, {
                        Authorization: `Bearer ${authToken}`
                    });
                }
            }

        } catch (e) {
            console.error(e);
            if ((e as AxiosError)?.response?.data) {
                return fail(400, { error: (e as AxiosError).response?.data as Record<string, unknown> });
            }
            return fail(400, { error: e as Record<string, unknown> });
        }
    }
} satisfies Actions;
