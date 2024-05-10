import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
    const authToken = (await parent()).authToken;
    if (authToken) {
        throw redirect(302, '/account');
    }
};
