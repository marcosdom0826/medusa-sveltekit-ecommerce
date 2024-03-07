import { medusa } from '$/lib/medusa';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    let order: Awaited<ReturnType<typeof medusa.orders.retrieve>>;
    try {
        order = await medusa.orders.retrieve(params.order);
        if (!order.order) {
            error(404, 'Not found');
        }
    } catch (e) {
        throw error(404, 'Not found');
    }

    return {
        order: order.order
    };
};
