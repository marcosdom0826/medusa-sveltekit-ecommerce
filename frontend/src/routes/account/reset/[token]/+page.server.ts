import { medusa } from '$/lib/medusa';
import { fail, redirect } from '@sveltejs/kit';
import type { AxiosError } from 'axios';
import type { Actions, PageServerLoad } from './$types';
import { LOGIN_EXPIRY_DAYS } from '$/lib/const';

export const load: PageServerLoad = async ({ parent, params }) => {
    const authToken = (await parent()).authToken;
    if (authToken) {
        throw redirect(302, '/account');
    }

    if (!params.token) {
        throw redirect(302, '/account/reset');
    }

    return {
        token: params.token
    };
};

export const actions = {
    default: async (event) => {
        const data = (await event.request.formData());

        try {
            await medusa.customers.resetPassword({
                email: data.get('email') as string,
                password: data.get('password') as string,
                token: data.get('token') as string
            });
            const loginRes = await medusa.auth.getToken({
                email: data.get('email') as string,
                password: data.get('password') as string
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
