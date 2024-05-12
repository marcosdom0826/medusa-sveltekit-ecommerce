import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { LOGIN_EXPIRY_DAYS } from '$/lib/const';
import { medusa } from '$/lib/medusa';
import type { AxiosError } from 'axios';

export const load: PageServerLoad = async ({ parent }) => {
    const authToken = (await parent()).authToken;
    if (!authToken) {
        throw redirect(302, '/account/login');
    }

};


export const actions = {
    default: async (event) => {
        const authToken = event.cookies.get('auth_token');

        const data = await event.request.formData();
        try {
            await medusa.customers.update({
                email: data.get('email') as string,
                password: data.get('password') as string
            });
            const loginRes = await medusa.auth.getToken({
                email: data.get('email') as string,
                password: data.get('password') as string
            }, {
                Authorization: `Bearer ${authToken}`
            });
            event.cookies.set(
                'auth_token',
                loginRes.access_token,
                {
                    path: '/',
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * LOGIN_EXPIRY_DAYS)
                }
            );
        } catch (e) {
            console.error(e);
            if ((e as AxiosError)?.response?.data) {
                return fail(400, { error: (e as AxiosError).response?.data as Record<string, unknown> });
            }
            return fail(400, { error: e as Record<string, unknown> });
        }
        throw redirect(302, '/account');
    }
} satisfies Actions;
