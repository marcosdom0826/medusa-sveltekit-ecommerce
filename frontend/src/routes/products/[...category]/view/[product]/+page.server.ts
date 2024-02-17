// server-file
/* eslint-disable no-console */
import { medusa } from '$/lib/medusa';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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

        return {
            product: product,
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
