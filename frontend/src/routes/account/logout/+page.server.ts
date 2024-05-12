import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
    cookies.delete('auth_token', { path: '/' });
    throw redirect(302, '/account/login');
};
