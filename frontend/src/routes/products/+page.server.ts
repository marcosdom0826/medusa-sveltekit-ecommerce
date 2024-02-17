import { medusa } from '$/lib/medusa';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {

    const products = await medusa.products.list({
        // eslint-disable-next-line
        currency_code: 'eur',
        include_category_children: true
    });

    return {
        products: products.products,
        crumbs: [
            {
                name: 'Products',
                href: '/products'
            }
        ]
    };

};
