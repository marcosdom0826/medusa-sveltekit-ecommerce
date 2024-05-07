<script lang="ts">
import Cart from '$/lib/components/Cart.svelte';
import { t } from '$/lib/i18n';
import type { PageData } from './$types';

const { data }: { data: PageData } = $props();
const shippingCost = $derived(data.order.shipping_total || 0);
</script>

<div class="content">
    <div>
        <h2>Thank you for your order</h2>
        <div>
            <p>Your order has been placed and will be shipped soon.</p>
            <p>Thank you for shopping with us.</p>
        </div>
        <div class="order-info">
            <h3 class="wide">Contact</h3>
            <div class="columns contact">
                <span>Email:</span>
                <span style="white-space: nowrap;">{data.order?.email}</span>
                {#if data.order?.shipping_address?.phone}
                    <span>Phone:</span>
                    <span style="white-space: nowrap;">{data.order?.shipping_address?.phone}</span>
                {/if}
            </div>
            <h3 class="wide">Delivery Address</h3>
            <div class="columns">
                <span>
                    {data.order?.shipping_address?.first_name}
                    {data.order?.shipping_address?.last_name}
                </span>
                {#if data.order?.shipping_address?.company}
                    <span class="wide">{data.order?.shipping_address?.company}</span>
                {/if}
                <span class="wide">{data.order?.shipping_address?.address_1}</span>
                <span>{data.order?.shipping_address?.postal_code} {data.order?.shipping_address?.city}</span>
            </div>
            {#if data.order?.billing_address}
                <h3 class="wide">Billing Address</h3>
                <div class="columns">
                    <span>
                        {data.order?.billing_address?.first_name}
                        {data.order?.billing_address?.last_name}
                    </span>
                    {#if data.order?.billing_address?.company}
                        <span class="wide">{data.order?.billing_address?.company}</span>
                    {/if}
                    <span class="wide">{data.order?.billing_address?.address_1}</span>
                    <span>
                        {data.order?.billing_address?.postal_code}
                        {data.order?.billing_address?.city}
                    </span>
                </div>
            {/if}

            <h3 class="wide">Shipping method</h3>
            <div class="columns">
                <span>{data.order?.shipping_methods?.[0]?.shipping_option?.name || 'E-Mail'}</span>
                <span>{shippingCost > 0 ? `${shippingCost / 100}€` : 'Free'}</span>
            </div>
        </div>
        <div class="rhs">
            <Cart items="{data.order.items}" disableEdit>
                {#snippet total()}
                    <div class="total">
                        <h4>Subtotal:</h4>
                        <span class="rhs">{(data.order?.subtotal || 0) / 100}€</span>
                        <div class="discounts wide columns">
                            {#each data.order?.discounts || [] as discount (discount.id)}
                                <span style="text-align: start;">{discount.code}</span>
                                <span style="text-align: end;">-{discount.rule.value}%</span>
                            {/each}
                            {#if data.order?.gift_card_total}
                                <span style="text-align: start;">Gift Cards</span>
                                <span style="text-align: end;">-{data.order.gift_card_total / 100}€</span>
                            {/if}
                        </div>
                        <span>Shipping:</span>
                        <span class="rhs">{shippingCost === 0 ? 'Free' : `${shippingCost / 100}€`}</span>
                        <h3>Total:</h3>
                        <span class="rhs">{data.order.total / 100}€</span>
                        <h3>Payment:</h3>
                        <!-- TODO: rome when eslint-plugin-svelte is updated -->
                        <!-- eslint-disable-next-line svelte/valid-compile -->
                        <span class="rhs">{$t(`payment.${data.order.payments?.[0].provider_id}`)}</span>
                        {#if data.order.payments?.[0].provider_id === 'manual'}
                            <!-- eslint-disable prettier/prettier -->
                            <p>
                                You will receive an invoice with payment instructions via e-email
                                Please wire the money withing 7 business days
                            </p>
                            <!-- eslint-enable prettier/prettier -->
                        {/if}
                    </div>
                {/snippet}
            </Cart>
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
    height: fit-content;

    /* @media (orientation: landscape) {
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
    } */

    & > div {
        display: grid;
        gap: 2em;
        width: 100%;

        & > :first-child {
            grid-column: 1 / -1;
            text-align: center;
        }
        & > :nth-child(2) {
            grid-column: 1 / -1;
            text-align: center;
        }
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

.total {
    display: grid;
    grid-template-columns: auto min-content;
    width: 100%;
    gap: 1em;
    align-items: center;

    & span {
        font-weight: bold;
    }
    & > .rhs {
        text-align: end;
    }
}

.discounts {
    opacity: 0.6;
    & > * {
        font-weight: normal !important;
    }
}
</style>
