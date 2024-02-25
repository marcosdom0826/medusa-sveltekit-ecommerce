// server-file
/* eslint-disable no-console */
import { medusa, type ProductOptionValue } from '$/lib/medusa';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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
