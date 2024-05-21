<script lang="ts">
import Cart from '$/lib/components/Cart.svelte';
import { t } from '$/lib/i18n';
t;
import type { PageData } from './$types';

const { data }: { data: PageData } = $props();
const shippingCost = $derived(data.order.shipping_total || 0);
</script>

<div class="content">
    <div>
        <div class="order-info">
            <div class="order-header">
                <div
                    class="indicator"
                    class:shipped="{data.order.status === 'completed' ||
                        data.order.fulfillment_status === 'shipped'}"
                    class:pending="{data.order.status === 'pending'}"
                    class:attention="{data.order.status === 'archived' ||
                        data.order.status === 'canceled' ||
                        data.order.status === 'requires_action'}"
                    class:awaiting-payment="{data.order.payment_status === 'awaiting'}">
                </div>
                <span>{new Date(data.order.created_at).toLocaleDateString()}</span><span>{' '}-{' '}</span>
                {#if data.order.payment_status === 'awaiting'}
                    <span>Awaiting Payment</span>
                {:else if data.order.fulfillment_status === 'shipped'}
                    <span>Shipped</span>
                {:else}
                    <span>{$t(`order_status_${data.order.status}`)}</span>
                {/if}
            </div>
            <div class="columns">
                <span style="white-space: nowrap; font-weight: bold;">Order Number:</span>
                <span>#{data.order.display_id}</span>
            </div>
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
            {#if data.order?.fulfillment_status === 'shipped'}
                <div class="columns">
                    {#each data.order?.fulfillments as fulfilment}
                        {#if fulfilment.tracking_links?.[0]}
                            {#each fulfilment.tracking_links as trackingLink}
                                {#if trackingLink.url}
                                    <a target="_blank" rel="noopener noreferrer" href="{trackingLink.url}"
                                        >Track Shipping</a>
                                    <div></div>
                                {:else if trackingLink.tracking_number.startsWith('http')}
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href="{trackingLink.tracking_number}">Track Shipping</a>
                                    <div></div>
                                {:else}
                                    <span>Tracking Number:</span><span
                                        >{' '}{trackingLink.tracking_number}</span>
                                {/if}
                            {/each}
                        {/if}
                    {/each}
                </div>
            {/if}
        </div>
        <div class="rhs">
            <Cart items="{data.order.items}" disableEdit disableMinWidth>
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

.order-header {
    display: flex;
    gap: 1em;
    align-items: center;
    font-size: 1.25em;
    & > :nth-child(2) {
        font-weight: bold;
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

.indicator {
    width: 1em;
    height: 1em;
    border-radius: 100%;
    background-color: var(--textColor);
}

.awaiting-payment {
    background-color: orangered !important;
}

.shipped {
    background-color: green !important;
}

.pending {
    background-color: hsl(46, 100%, 50%);
}

.attention {
    background-color: red;
}
</style>
