import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async ({ params, parent }) => {
    const parentData = await parent();
    const categories = params.category?.split('/').filter((c) => c.length > 0);
    try {
        return {
            crumbs: [
                {
                    name: 'Products',
                    href: '/products'
                },
                ...(categories?.map((c, idx) => ({
                    name: parentData.categoriesByHandle[c].name,
                    href: `/products/${categories.slice(0, idx + 1).join('/')}`
                })) || [])
            ]
        };
    } catch (e) {
        error(404, 'Not found');
    }
};
