import { medusa } from '$/lib/medusa';
import type { PageServerLoad } from './$types';


const HOME_CATEGORY = 'fresh';

export const load: PageServerLoad = async ({ parent }) => {

    const parentData = await parent();

    const products = await medusa.products.list({
        // eslint-disable-next-line
        currency_code: 'eur',
        include_category_children: true,
        limit: 10,
        offset: 0,
        category_id: [parentData.categoriesByHandle[HOME_CATEGORY].id]
    });

    return {
        products: products.products

    };

};
