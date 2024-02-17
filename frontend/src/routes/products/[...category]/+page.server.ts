import { medusa } from '$/lib/medusa';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params }) => {

    const parentData = await parent();
    const categories = params.category.split('/').filter((c) => c.length > 0);

    const category = categories[categories.length - 1];

    if (!parentData.categoriesByHandle[category]?.id) {
        error(404, 'Category not found');
    }

    const products = await medusa.products.list({
        currency_code: 'eur',
        include_category_children: true,
        category_id: [
            parentData.categoriesByHandle[category].id,
            ...(
                parentData.categoriesByHandle[category]
                    ?.category_children
                    ?.map((c) => c.id)
                || []
            )
        ]
    });

    return {
        products: products.products,
        crumbs: [
            {
                name: 'Products',
                href: '/products'
            },
            ...categories.map((c, idx) => ({
                name: parentData.categoriesByHandle[c].name,
                href: `/products/${categories.slice(0, idx + 1).join('/')}`
            }))
        ]
    };

};
