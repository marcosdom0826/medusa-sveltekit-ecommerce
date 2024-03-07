/* eslint-disable no-console */
import { medusa, type Cart } from '$/lib/medusa';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { AxiosError } from 'axios';

export const load: PageServerLoad = async ({ parent }) => {

    const parentData = await parent();
    if (!parentData.cart) {
        throw redirect( 303, '/');
    }
    const shippingOptions =
    await medusa.shippingOptions.listCartOptions(parentData.cart.id);

    return {
        shippingOptions: shippingOptions.shipping_options
    };

};

const validateEmail = (email: string) => {
    const at = email.indexOf('@');
    const dot = email.lastIndexOf('.');
    return email.length > 0 &&
      at > 0 &&
      dot > at + 1 &&
      dot < email.length &&
      email[at + 1] !== '.' &&
      email.indexOf(' ') === -1 &&
      email.indexOf('..') === -1;
};
const validatorFunctions: Record<string, (v: string, cart?: Cart) => boolean> = {
    invoiceAddress: (value: string) => value === 'asDelivery' || value === 'separateAddress',
    email: (value: string) => validateEmail(value),
    zip: (value: string) => value.length > 0 && /^\d*$/.test(value),
    phone: (value: string) => /^(\d|\s|\+|\/)*$/.test(value)

};


export const actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const cartId = event.cookies.get('cart_id');

        let cart;
        if (cartId) {
            try {
                cart = await medusa.carts.retrieve(cartId);
            } catch (e) {
                console.error(e);
            }
        }
        if (!cart) {
            throw redirect(303, '/');
        }
        const optionalKeys = ['company', 'phone', 'invoice-company'];

        const fails: Record<string, string> = {};
        const failData: Record<string, unknown> = {};
        for (const [key, value] of data.entries()) {
            if (!optionalKeys.includes(key) && !value) {
                fails[key] = `${key} is required`;
                failData[key] = value;
            }
            if (validatorFunctions[key]?.(value.toString(), cart?.cart) === false) {
                fails[key] = `${key} is invalid`;
                failData[key] = value;
            }
        }

        if (Object.keys(fails).length > 0) {
            return fail(400, { ...failData, fieldErrors: fails });
        }

        try {
            await medusa.carts.update(cart.cart.id, {
                email: data.get('email') as string,
                shipping_address: {
                    first_name: data.get('first_name') as string,
                    last_name: data.get('last_name') as string,
                    address_1: data.get('address') as string,
                    city: data.get('city') as string,
                    country_code: data.get('country') as string,
                    postal_code: data.get('zip') as string,
                    phone: data.get('phone') as string,
                    company: data.get('company') as string
                },
                ...(data.get('invoiceAddress') === 'separateAddress' ? {
                    billing_address: {
                        first_name: data.get('invoice-first_name') as string,
                        last_name: data.get('invoice-last_name') as string,
                        address_1: data.get('invoice-address') as string,
                        city: data.get('invoice-city') as string,
                        postal_code: data.get('invoice-zip') as string,
                        company: data.get('invoice-company') as string,
                        country_code: data.get('invoice-country') as string
                    }
                } : {})
            });
            await medusa.carts.addShippingMethod(cart.cart.id, {
                option_id: data.get('shippingOption') as string
            });

        } catch (e) {
            console.error(e);
            if ((e as AxiosError)?.response?.data) {
                return fail(400, { error: (e as AxiosError).response?.data as Record<string, unknown> });
            }
            return fail(400, { error: e as Record<string, unknown> });
        }
        throw redirect(303, '/checkout/payment');
    }
} satisfies Actions;
