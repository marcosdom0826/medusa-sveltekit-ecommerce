import type { LayoutServerLoad } from './$types';
import { medusa, type Customer, type ProductCategory } from '$/lib/medusa';
import { ENABLE_GIFT_CARDS, VIRTUAL_ALL_CATEGORY } from '$env/static/private';

const createVirtualCategory = (name: string, handle: string, nav: boolean, rank: number) => ({
    id: handle,
    handle,
    rank,
    metadata: {
        nav,
        virtual: true
    },
    name
});

export const load: LayoutServerLoad = async ({ cookies }) => {
    const authToken = cookies.get('auth_token');
    let customer: Customer|undefined;
    if (authToken) {
        try {
            customer = (await medusa.customers.retrieve({
                Authorization: `Bearer ${authToken}`
            })).customer;
        } catch ( e) {
            cookies.delete('auth_token', { path: '/' });
            customer = undefined;
        }
    }

    const productCategories: (Partial<ProductCategory> & Pick<ProductCategory, 'id' | 'handle' | 'name' | 'rank'>)[] = (
        await medusa.productCategories.list()
    ).product_categories;

    if (ENABLE_GIFT_CARDS) {
        productCategories.push(createVirtualCategory('Gift Cards', 'giftcards', true, 1000));
    }

    if (VIRTUAL_ALL_CATEGORY) {
        productCategories.unshift(createVirtualCategory('All', 'all', false, -1));
    }

    const cartId = cookies.get('cart_id');
    let cart;
    if (cartId) {
        try {
            cart = await medusa.carts.retrieve(cartId, authToken ? {
                Authorization: `Bearer ${authToken}`
            } : undefined);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }
        if (authToken && !cart?.cart?.customer_id) {
            try {
                await medusa.carts.update(cartId, {
                    customer_id: customer?.id
                }, {
                    Authorization: `Bearer ${authToken}`
                });
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }
        }
    }

    const categoriesByHandle: Record<string, ProductCategory> = productCategories
        .reduce((acc, category) => ({
            ...acc,
            [category.handle]: {
                ...category
            }
        }), {});

    return {
        productCategories: productCategories,
        categoriesByHandle: categoriesByHandle,
        cart: cart?.cart,
        authToken,
        customer
    };
};
