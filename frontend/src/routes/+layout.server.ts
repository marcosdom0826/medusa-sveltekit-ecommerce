import type { LayoutServerLoad } from './$types';
import { medusa, type ProductCategory } from '$/lib/medusa';
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
            cart = await medusa.carts.retrieve(cartId);
        } catch (e) {
            console.error(e);
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
        cart: cart?.cart
    };
};
