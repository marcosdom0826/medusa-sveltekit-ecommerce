import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { medusa } from '$/lib/medusa';
import type { AxiosError } from 'axios';
import { LOGIN_EXPIRY_DAYS } from '$/lib/const';

export const load: PageServerLoad = async ({ parent }) => {
    const authToken = (await parent()).authToken;
    if (authToken) {
        throw redirect(302, '/account');
    }
};

export const actions = {
    default: async ( event ) => {
        const data = await event.request.formData();
        try {
            const loginRes = await medusa.auth.getToken({
                email: data.get('email') as string,
                password: data.get('password') as string
            });
            await medusa.customers.retrieve();
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
