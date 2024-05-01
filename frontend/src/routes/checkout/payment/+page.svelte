<script lang="ts">
import Cart from '$/lib/components/Cart.svelte';
import { page } from '$app/stores';
import { slide, fade } from 'svelte/transition';
import type { PageData } from './$types';
import { t } from '$lib/i18n';
import { applyAction, deserialize, enhance } from '$app/forms';
import { loadScript, type OnInitActions, type PayPalButtonsComponentOptions } from '@paypal/paypal-js';
import LoadingSpinner from '$/lib/components/LoadingSpinner.svelte';
import type { ActionResult } from '@sveltejs/kit';
import { PUBLIC_PAYPAL_CLIENT_ID } from '$env/static/public';

export let data: PageData;

let loading = false;

let htmlForm: HTMLFormElement | undefined;

let selectedPaymentProvider = data.cart?.payment_session?.provider_id || 'paypal';

$: shippingCost = data.cart?.shipping_methods?.[0]?.shipping_option?.amount || 0;

/* eslint-disable prettier/prettier */
$: sortedPaymentOptions =
    data.cart?.payment_sessions?.sort((a, b) =>
        a.provider_id === 'paypal'
            ? -1
            : b.provider_id === 'paypal'
                ? 1
                : a.provider_id.localeCompare(b.provider_id)
    ) || [];
/* eslint-enable prettier/prettier */

let width: number;
let height: number;

$: portrait = width < height;

let portraitCartExpanded = false;

let ppInitActions: OnInitActions | undefined;

/* eslint-disable prettier/prettier */
const paypalButtonOptions: PayPalButtonsComponentOptions = {
    style: {
        height: 53,
        // @ts-expect-error borderRadius is documented but not in paypals types...
        borderRadius: 8
    },
    displayOnly: ['vaultable'],
    onInit: (ppData, actions) => {
        ppInitActions = actions;
    },
    onCancel: () => {
        // has to be there otherwise it breaks...
    },
    onClick: () => {
        // has to be there otherwise it breaks...
    },
    // eslint-disable-next-line no-console
    onError: (err) => console.error('Paypal error:', err),

    createOrder: async () => {
        // HACK!: We are most definitely to fast for paypal here, so waiting a full second avoids some race-condition in their shitty SDK
        // This shit took me TWO FUCKING FULL DAYS to discover
        // TWO FULL DAYS!
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (data?.cart?.payment_session?.provider_id !== 'paypal') {
            throw new Error('payment session is not paypal');
        }
        if (!data?.cart?.payment_session?.data?.id) {
            throw new Error('No payment session id');
        }
        if (typeof data.cart.payment_session?.data?.id !== 'string') {
            throw new Error('Payment session id is not a string');
        }
        return data.cart.payment_session.data.id;
    },
    onApprove: async (ppData, actions) => actions.order?.authorize().then(async (authorization) => {
        if (authorization.status !== 'COMPLETED') {
            // eslint-disable-next-line no-console
            console.error('Authorization not completed', authorization.status);
            await ppInitActions?.enable();
            return;
        }
        try {
            const formData = new FormData();
            formData.set('authorization', JSON.stringify(authorization));
            const response = await fetch('?/placePaypalOrder', {
                method: 'POST',
                body: formData
            });
            const result: ActionResult = deserialize(await response.text());
            await applyAction(result);
        } finally {
            await ppInitActions?.enable();
        }

    })
};

$: paypalScript = loadScript({
    clientId: PUBLIC_PAYPAL_CLIENT_ID,
    currency: 'EUR',
    debug: false,
    intent: 'authorize',
    disableFunding: 'card'
});

/* eslint-enable prettier/prettier */
</script>

<svelte:window bind:innerWidth="{width}" bind:innerHeight="{height}" />

<div class="content">
    <div>
        <div>
            <div class="order-info">
                <h3 class="wide">Contact</h3>
                <div class="columns contact">
                    <span>Email:</span>
                    <span style="white-space: nowrap;">{data.cart?.email}</span>
                    {#if data.cart?.shipping_address?.phone}
                        <span>Phone:</span>
                        <span style="white-space: nowrap;">{data.cart?.shipping_address?.phone}</span>
                    {/if}
                </div>
                <h3 class="wide">Delivery Address</h3>
                <div class="columns">
                    <span>
                        {data.cart?.shipping_address?.first_name}
                        {data.cart?.shipping_address?.last_name}
                    </span>
                    {#if data.cart?.shipping_address?.company}
                        <span class="wide">{data.cart?.shipping_address?.company}</span>
                    {/if}
                    <span class="wide">{data.cart?.shipping_address?.address_1}</span>
                    <span
                        >{data.cart?.shipping_address?.postal_code} {data.cart?.shipping_address?.city}</span>
                </div>
                {#if data.cart?.billing_address}
                    <h3 class="wide">Billing Address</h3>
                    <div class="columns">
                        <span>
                            {data.cart?.billing_address?.first_name}
                            {data.cart?.billing_address?.last_name}
                        </span>
                        {#if data.cart?.billing_address?.company}
                            <span class="wide">{data.cart?.billing_address?.company}</span>
                        {/if}
                        <span class="wide">{data.cart?.billing_address?.address_1}</span>
                        <span>
                            {data.cart?.billing_address?.postal_code}
                            {data.cart?.billing_address?.city}
                        </span>
                    </div>
                {/if}

                <h3 class="wide">Shipping method</h3>
                <div class="columns">
                    <span>{data.cart?.shipping_methods?.[0]?.shipping_option?.name || 'E-Mail'}</span>
                    <span>{shippingCost > 0 ? `${shippingCost / 100}€` : 'Free'}</span>
                </div>
            </div>
            <h3>Payment</h3>
            <form
                bind:this="{htmlForm}"
                method="post"
                action="?/setPaymentSession"
                on:input="{() => {
                    htmlForm?.requestSubmit();
                }}"
                use:enhance="{async () =>
                    async ({ update, result }) => {
                        await update({ reset: false });
                        await applyAction(result);
                    }}">
                <fieldset>
                    {#each sortedPaymentOptions as paymentOption}
                        <label for="{paymentOption.id}">
                            <input
                                type="radio"
                                id="{paymentOption.id}"
                                name="paymentProvider"
                                value="{paymentOption.provider_id}"
                                bind:group="{selectedPaymentProvider}" />
                            <span>{$t(`payment.${paymentOption.provider_id}`)}</span>
                        </label>
                    {/each}
                </fieldset>
            </form>
        </div>
        <div class="rhs">
            {#if portrait}
                <button
                    class="expand-cart-button"
                    on:click="{(e) => {
                        e.preventDefault();
                        portraitCartExpanded = !portraitCartExpanded;
                    }}">
                    {portraitCartExpanded ? 'Hide' : 'Show'} Cart
                </button>
            {/if}
            {#if !portrait || portraitCartExpanded}
                <div transition:slide>
                    <Cart disableMinWidth="{true}" disableEdit="{true}">
                        <div slot="total"></div>
                    </Cart>
                </div>
            {/if}
            <div class="total">
                <h4>Subtotal:</h4>
                <span>{($page.data.cart?.subtotal || 0) / 100}€</span>
                <div class="discounts wide columns">
                    {#each data.cart?.discounts || [] as discount (discount.id)}
                        <span style="text-align: start;">{discount.code}</span>
                        <span style="text-align: end;">-{discount.rule.value}%</span>
                    {/each}
                    {#each data.cart?.gift_cards || [] as giftCard (giftCard.id)}
                        <span style="text-align: start;">{giftCard.code}</span>
                        <span style="text-align: end;">-{giftCard.balance / 100}€</span>
                    {/each}
                </div>
                <span>Shipping:</span>
                <span>{shippingCost === 0 ? 'Free' : `${shippingCost / 100}€`}</span>
                <h3>Total:</h3>
                <span>{(($page.data.cart?.total || 0) + shippingCost) / 100}€</span>
            </div>
            <form
                action="?/placeOrder"
                method="post"
                use:enhance="{async () => {
                    loading = true;
                    return async ({ update, result }) => {
                        await update({ reset: false });
                        loading = false;
                        await applyAction(result);
                    };
                }}">
                <div class="overlap">
                    {#if selectedPaymentProvider === 'paypal'}
                        <div transition:fade id="paypal-button-container">
                            <!-- eslint-disable prettier/prettier -->
                            {#await paypalScript?.then((pp) => pp
                                ?.Buttons?.(paypalButtonOptions)
                                ?.render('#paypal-button-container'))}
                                <div transition:fade class="spinner-container">
                                    <LoadingSpinner ringWidth="0.4em" size="3em" />
                                </div>
                            {/await}
                            <!-- eslint-enable prettier/prettier -->
                        </div>
                    {:else}
                        <button transition:fade class="primary" type="submit" disabled="{loading}">
                            {#if loading}
                                <LoadingSpinner size="1.3em" ringWidth="0.25em" />
                            {:else}
                                Place order and Pay
                            {/if}
                        </button>
                    {/if}
                </div>
            </form>
        </div>
    </div>
</div>

<style lang="postcss">
.content {
    width: min(100%, 1800px);
    justify-self: center;
    display: grid;
    justify-content: center;
    padding: 1em;

    @media (orientation: landscape) {
        &::after {
            content: '';
            position: absolute;
            top: 1em;
            bottom: 1em;
            right: 50%;
            width: 1px;
            opacity: 0.25;
            background-color: var(--textColor);
        }
    }
    & > div {
        display: grid;
        gap: 2em;
        width: 100%;

        @media (orientation: portrait) {
            grid-template-columns: 100%;
            width: 100%;
            overflow-x: hidden;
        }

        grid-template-columns: repeat(2, 1fr);
        @media (orientation: landscape) {
            & > * {
                width: 100%;
            }
        }
    }
}

form {
    display: grid;
    gap: 1em;
    width: 100%;
}

.rhs {
    display: grid;
    gap: 1em;
    height: fit-content;
}

.order-info {
    & > :first-child {
        margin-top: 0;
    }
    & h3 {
        margin-top: 1em;
    }

    & > .columns {
        padding: 1em;
    }
    & > .contact {
        gap: 0.5em;
        & > :nth-child(odd) {
            font-weight: bold;
        }
    }
}

.wide {
    grid-column: 1 / -1;
}

.columns {
    display: grid;
    grid-template-columns: auto min-content;
    padding: 0;

    @media (orientation: portrait) {
        overflow-x: hidden;
    }
}

.expand-cart-button {
    display: grid;
    place-items: center;
    width: 100%;
}

.total {
    display: grid;
    grid-template-columns: auto min-content;
    width: 100%;
    gap: 1em;
    align-items: center;

    & span {
        font-weight: bold;
    }
    & > :nth-of-type(even):span {
        text-align: end;
    }
}

.discounts {
    opacity: 0.6;
    & > * {
        font-weight: normal !important;
    }
}

fieldset {
    display: grid;
    gap: 1em;
    padding: 1em;
    & label {
        position: relative;
        display: flex;
        gap: 1em;
        align-items: center;
        isolation: isolate;

        & span {
            position: relative;
            padding: 0;
        }

        &:hover,
        &:focus-visible {
            & input[type='radio']:not(:checked)::before {
                background-color: color-mix(in srgb, var(--textColor), transparent 75%);
            }
        }
    }
}

.overlap {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: min-content;

    & > * {
        grid-row: 1;
        grid-column: 1;
        width: 100%;
        height: fit-content;
    }
}

.spinner-container {
    display: grid;
    justify-content: center;
    height: fit-content;
}

#paypal-button-container {
    /* fixes paypal background transparency */
    color-scheme: auto;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: min-content;

    & > :global(*) {
        grid-row: 1;
        grid-column: 1;
        width: 100%;
        height: fit-content;
    }
}

:global(.paypal-checkout-sandbox) {
    /* fixes paypal background transparency */
    color-scheme: auto;
}
</style>
