import { medusa } from '$/lib/medusa';
import { safeParseInt } from '$/lib/util';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {

    const limit = 100;
    const pageOffset = url.searchParams.get('page')
        ? (safeParseInt(url.searchParams.get('page') || '1', 1) - 1) * limit
        : 0;
    const products = await medusa.products.list({
        currency_code: 'eur',
        include_category_children: true,
        limit,
        offset: pageOffset
    });

    return {
        products: products.products,
        page: (pageOffset / limit) + 1,
        pageCount: Math.ceil(products.count / products.limit),
        crumbs: [
            {
                name: 'Products',
                href: '/products'
            }
        ]
    };

};
