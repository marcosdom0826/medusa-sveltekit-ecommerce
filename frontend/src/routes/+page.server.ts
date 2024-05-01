import { medusa } from '$/lib/medusa';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { AxiosError } from 'axios';

const HOME_CATEGORY = 'fresh';

export const load: PageServerLoad = async ({ parent }) => {

    const parentData = await parent();

    const products = await medusa.products.list({
        currency_code: 'eur',
        include_category_children: true,
        limit: 10,
        offset: 0,
        category_id: [parentData.categoriesByHandle[HOME_CATEGORY].id]
    });

    return {
        products: products.products

    };

};

export const actions = {
    editCart: async (event) => {
        const data = await event.request.formData();
        const id = data.get('id') as string;
        const quantity = Number.parseInt(data.get('quantity') as string, 10);
        const cartId = event.cookies.get('cart_id');
        if (!cartId || !id || !quantity) {
            return fail(400, {});
        }
        try {
            await medusa.carts.lineItems.update(cartId, id, {
                quantity: quantity
            });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            return fail(400, (e as AxiosError)?.response?.data as Record<string, unknown> || {});
        }
    },
    incrementCartItem: async (event) => {
        const data = await event.request.formData();
        const id = data.get('id') as string;
        const quantity = Number.parseInt(data.get('quantity') as string, 10);
        const cartId = event.cookies.get('cart_id');
        if (!cartId || !id || !quantity) {
            return fail(400, {});
        }
        try {
            await medusa.carts.lineItems.update(cartId, id, {
                quantity: quantity + 1
            });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            return fail(400, (e as AxiosError)?.response?.data as Record<string, unknown> || {});
        }
    },
    decrementCartItem: async (event) => {
        const data = await event.request.formData();
        const id = data.get('id') as string;
        const quantity = Number.parseInt(data.get('quantity') as string, 10);
        const cartId = event.cookies.get('cart_id');
        if (!cartId || !id || !quantity) {
            return fail(400, {});
        }
        await medusa.carts.lineItems.update(cartId, id, {
            quantity: quantity - 1
        });
    },
    removeCartItem: async (event) => {
        const data = await event.request.formData();
        const id = data.get('id') as string;
        const quantity = Number.parseInt(data.get('quantity') as string, 10);
        const cartId = event.cookies.get('cart_id');
        if (!cartId || !id || !quantity) {
            return fail(400, {});
        }
        await medusa.carts.lineItems.update(cartId, id, {
            quantity: 0
        });
    }
} satisfies Actions;
