import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { medusa } from '$/lib/medusa';
import { safeParseInt } from '$/lib/util';

export const load: PageServerLoad = async ({ parent, url }) => {
    const authToken = (await parent()).authToken;
    if (!authToken) {
        throw redirect(302, '/account/login');
    }

    const limit = 10;
    const pageOffset = url.searchParams.get('page')
        ? (safeParseInt(url.searchParams.get('page') || '1', 1) - 1) * limit
        : 0;
    const orders = (await medusa.customers.listOrders({
        limit,
        offset: pageOffset
    }, {
        Authorization: `Bearer ${authToken}`
    }));


    return {
        orders: orders.orders,
        page: (pageOffset / limit) + 1,
        pageCount: Math.ceil(orders.count / orders.limit)
    };

};
