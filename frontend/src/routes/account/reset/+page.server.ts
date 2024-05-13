import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { medusa } from '$/lib/medusa';
import type { AxiosError } from 'axios';

export const load: PageServerLoad = async ({ parent }) => {
    const authToken = (await parent()).authToken;
    if (authToken) {
        throw redirect(302, '/account');
    }
};

export const actions = {
    requestReset: async (event) => {
        const data = await event.request.formData();

        try {
            await medusa.customers.generatePasswordToken({
                email: data.get('email') as string
            });
        } catch (e) {
            console.error(e);
            if ((e as AxiosError)?.response?.data) {
                return fail(400, { error: (e as AxiosError).response?.data as Record<string, unknown> });
            }
            return fail(400, { error: e as Record<string, unknown> });
        }

        throw redirect(302, '/');
    }
} satisfies Actions;
