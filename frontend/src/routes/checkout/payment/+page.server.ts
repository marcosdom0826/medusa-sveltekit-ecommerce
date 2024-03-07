/* eslint-disable no-console */
import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { medusa } from '$/lib/medusa';


export const load: PageServerLoad = async ({ parent }) => {

    const parentData = await parent();
    if (!parentData.cart) {
        throw redirect( 303, '/');
    }

    if (!parentData.cart.payment_session) {
        const cartWithSessions = await medusa.carts.createPaymentSessions(parentData.cart.id);
        const updatedCart = await medusa.carts.setPaymentSession(cartWithSessions.cart.id, {
            provider_id: 'paypal'
        });
        return {
            cart: updatedCart.cart
        };
    }


};

export const actions = {
    setPaymentSession: async (event) => {
        const data = await event.request.formData();
        const cartId = event.cookies.get('cart_id');

        let cart;
        if (cartId) {
            try {
                cart = await medusa.carts.retrieve(cartId);
            } catch (e) {
                console.error(e);
            }
        }
        if (!cart) {
            throw redirect(303, '/');
        }

        const paymentProvider = data.get('paymentProvider') as string;
        if (!paymentProvider) {
            return fail(400, {});
        }

        const updatedCart = await medusa.carts.setPaymentSession(cart.cart.id, {
            provider_id: paymentProvider
        });

        return updatedCart.cart;

    },
    placePaypalOrder: async (event) => {
        const cartId = event.cookies.get('cart_id');
        const data = await event.request.formData();

        let cart;
        if (cartId) {
            try {
                cart = await medusa.carts.retrieve(cartId);
            } catch (e) {
                console.error(e);
            }
        }
        if (!cart) {
            throw redirect(303, '/');
        }

        if (!cart.cart.payment_session) {
            throw fail(400, {});
        }

        if (cart.cart.payment_session.provider_id !== 'paypal') {
            throw fail(400, {});
        }

        const authorization = JSON.parse(data.get('authorization') as string);

        cart = await medusa.carts.updatePaymentSession(cart.cart.id, 'paypal', {
            data: {
                data: {
                    ...authorization
                }
            }
        });

        const order = await medusa.carts.complete(cart.cart.id);

        if (!order || order.type !== 'order') {
            throw fail(400, {});
        }
        if (!order.data.id) {
            throw fail(400, {});
        }

        event.cookies.delete('cart_id', { path: '/' });

        throw redirect(303, `/checkout/success/${order.data.id}`);

    },
    placeOrder: async (event) => {
        const cartId = event.cookies.get('cart_id');

        let cart;
        if (cartId) {
            try {
                cart = await medusa.carts.retrieve(cartId);
            } catch (e) {
                console.error(e);
            }
        }
        if (!cart) {
            throw redirect(303, '/');
        }

        if (!cart.cart.payment_session) {
            throw fail(400, {});
        }

        if (cart.cart.payment_session.provider_id !== 'manual') {
            throw fail(400, {});
        }

        // cart = await medusa.carts.updatePaymentSession(cart.cart.id, 'manual', {
        //     data: {

        //     }
        // });

        const order = await medusa.carts.complete(cart.cart.id);

        if (!order || order.type !== 'order') {
            throw fail(400, {});
        }

        if (!order.data.id) {
            throw fail(400, {});
        }

        event.cookies.delete('cart_id', { path: '/' });

        throw redirect(303, `/checkout/success/${order.data.id}`);
    }
} satisfies Actions;
