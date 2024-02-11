import type { LayoutServerLoad } from './$types';
import { medusa } from '$/lib/medusa';
import { ENABLE_GIFT_CARDS } from '$env/static/private';

export const load: LayoutServerLoad = async () => {
    const productCategories = await medusa.productCategories.list();

    const headerCategories: Record<string, typeof productCategories.product_categories[0]> = productCategories.product_categories
        .filter((category) => !!category.metadata.nav)
        .reduce((acc, category) => ({
            ...acc,
            [category.handle]: {
                ...category
            }
        }), {});

    if (ENABLE_GIFT_CARDS) {
        Object.assign(headerCategories, {
            giftcards: {
                id: 'giftcards',
                handle: 'giftcards',
                metadata: {
                    nav: true,
                    position: 0
                },
                name: 'Gift Cards'
            }
        });
    }

    return {
        productCategories: productCategories.product_categories,
        headerCategories: headerCategories
    };
};
