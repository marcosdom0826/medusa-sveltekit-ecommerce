import { medusa } from '$/lib/medusa';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';


const HOME_CATEGORY = 'fresh';

export const load: PageServerLoad = async ({ parent }) => {

    const parentData = await parent();

    const products = await medusa.products.list({
        // eslint-disable-next-line
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
            throw fail(400, {});
        }
        await medusa.carts.lineItems.update(cartId, id, {
            quantity: quantity
        });
    },
    incrementCartItem: async (event) => {
        const data = await event.request.formData();
        const id = data.get('id') as string;
        const quantity = Number.parseInt(data.get('quantity') as string, 10);
        const cartId = event.cookies.get('cart_id');
        if (!cartId || !id || !quantity) {
            throw fail(400, {});
        }
        await medusa.carts.lineItems.update(cartId, id, {
            quantity: quantity + 1
        });
    },
    decrementCartItem: async (event) => {
        const data = await event.request.formData();
        const id = data.get('id') as string;
        const quantity = Number.parseInt(data.get('quantity') as string, 10);
        const cartId = event.cookies.get('cart_id');
        if (!cartId || !id || !quantity) {
            throw fail(400, {});
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
            throw fail(400, {});
        }
        await medusa.carts.lineItems.update(cartId, id, {
            quantity: 0
        });
    }
} satisfies Actions;
