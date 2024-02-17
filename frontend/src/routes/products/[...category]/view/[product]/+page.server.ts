import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
    const parentData = await parent();

    return {
        crumbs: [
            ...parentData.crumbs,
            {
                name: 'PRODUCTNAME',
                href: '.'
            }
        ]
    };
};
