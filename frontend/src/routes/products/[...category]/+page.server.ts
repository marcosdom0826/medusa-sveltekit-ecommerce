import { medusa } from '$/lib/medusa';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { safeParseInt } from '$/lib/util';

export const load: PageServerLoad = async ({ parent, params, url }) => {

    const parentData = await parent();
    const categories = params.category.split('/').filter((c) => c.length > 0);

    const category = categories[categories.length - 1];

    if (!parentData.categoriesByHandle[category]?.id) {
        error(404, 'Not found');
    }


    const limit = 100;
    const pageOffset = url.searchParams.get('page')
        ? (safeParseInt(url.searchParams.get('page') || '1', 1) - 1) * limit
        : 0;

    const products = await medusa.products.list({
        limit,
        offset: pageOffset,
        currency_code: 'eur',
        include_category_children: true,
        ...(
            params?.category?.includes('giftcards')
                ? {
                    is_giftcard: true
                } : {
                    category_id: [
                        parentData.categoriesByHandle[category].id,
                        ...(
                            parentData.categoriesByHandle[category]
                                ?.category_children
                                ?.map((c) => c.id)
                            || []
                        )
                    ]
                }
        )
    });

    return {
        products: products.products,
        page: (pageOffset / limit) + 1,
        pageCount: Math.ceil(products.count / products.limit)
    };

};
