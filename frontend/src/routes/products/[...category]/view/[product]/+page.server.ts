// server-file
/* eslint-disable no-console */
import { medusa, type ProductOptionValue } from '$/lib/medusa';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { safeParseJson } from '$/lib/util';

const HOME_CATEGORY = 'fresh';

export const load: PageServerLoad = async ({ parent, params }) => {
    const parentData = await parent();

    try {
        const product = (await medusa.products.list({
            currency_code: 'eur',
            include_category_children: true,
            handle: params.product
        }))?.products?.[0];

        if (!product) {
            error(404, 'Not found');
        }

        const productOptions = (product.options||[]).reduce<Record<string, Record<string, ProductOptionValue[]>>>((acc, option) => {
            acc[option.title] = option.values.reduce<Record<string, ProductOptionValue[]>>((inAcc, value) => {
                if (!inAcc[value.value]) {
                    inAcc[value.value] = [];
                }
                inAcc[value.value].push(value);
                return inAcc;
            }, {});
            return acc;
        }, {});


        const relatedProducts  = await medusa.products.list({
            currency_code: 'eur',
            include_category_children: true,
            limit: 10,
            offset: 0,
            category_id: [parentData.categoriesByHandle[HOME_CATEGORY].id]
        });


        return {
            product: product,
            productOptions: productOptions,
            relatedProducts: relatedProducts.products,
            crumbs: [
                ...parentData.crumbs,
                {
                    name: product.title,
                    href: '.'
                }
            ]
        };

    } catch (e) {
        console.error(e);
        error(404, 'Not found');
    }
};


export const actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const cookies = event.cookies;

        const cartId = cookies.get('cart_id');
        const selectedVariant = safeParseJson<ProductOptionValue[]>(data.get('variant') as string, []);

        let cart;
        if (cartId) {
            try {
                cart = await medusa.carts.retrieve(cartId);
            } catch (e) {
                console.error(e);
            }
        }
        if (!cart) {
            cart = await medusa.carts.create();
            cookies.set('cart_id', cart.cart.id, { path: '/' });
        }
        const maybeInCartItem = cart.cart.items?.find((i) => i.variant_id === selectedVariant[0].variant_id);
        if (maybeInCartItem) {
            await medusa.carts.lineItems.update(cart.cart.id, maybeInCartItem.id, {
                quantity: maybeInCartItem.quantity + 1
            });
        } else {
            await medusa.carts.lineItems.create(cart.cart.id, {
                variant_id: selectedVariant[0].variant_id,
                quantity: 1
            });

        }

    }
} satisfies Actions;
