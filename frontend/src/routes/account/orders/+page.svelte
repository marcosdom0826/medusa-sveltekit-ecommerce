<script lang="ts">
import Paginator from '$/lib/components/Paginator.svelte';
import { t } from '$lib/i18n';
t;
import type { PageData } from './$types';
const { data }: { data: PageData } = $props();
</script>

<div class="wrapper">
    <div>
        {#each data.orders as order}
            <div class="order-list-item">
                <div>
                    <div
                        class="indicator"
                        class:shipped="{order.status === 'completed' ||
                            order.fulfillment_status === 'shipped'}"
                        class:pending="{order.status === 'pending'}"
                        class:attention="{order.status === 'archived' ||
                            order.status === 'canceled' ||
                            order.status === 'requires_action'}"
                        class:awaiting-payment="{order.payment_status === 'awaiting'}">
                    </div>
                    <span>{new Date(order.created_at).toLocaleDateString()}</span><span>{' '}-{' '}</span>
                    {#if order.payment_status === 'awaiting'}
                        <span>Awaiting Payment</span>
                    {:else if order.fulfillment_status === 'shipped'}
                        <span>Shipped</span>
                    {:else}
                        <span>{$t(`order_status_${order.status}`)}</span>
                    {/if}
                </div>
                <span>Order Number:</span><span>#{order.display_id}</span>
                <span>Total:</span><span>{order.total / 100}€ <span>incl. shipping costs</span></span>
                <a href="/account/orders/{order.id}" class="button primary">View Details</a>
            </div>
        {/each}
    </div>
    <Paginator page="{data.page}" pageCount="{data.pageCount}" />
</div>

<style lang="postcss">
.wrapper {
    display: grid;
    justify-items: center;
    height: fit-content;
    gap: 0.5em;
    padding: 2rem;
    & > div {
        display: grid;
        gap: 2em;
        min-width: min(100%, 450px);
        & > :last-child {
            &::after {
                display: none;
            }
        }
    }
}

.order-list-item {
    display: grid;
    grid-template-columns: min-content auto;
    grid-row-gap: 0.5em;
    grid-column-gap: 1em;
    padding: 0.5em;
    position: relative;
    &::after {
        content: '';
        position: absolute;
        bottom: -1em;
        width: 100%;
        height: 1px;
        background-color: var(--textColor);
        opacity: 0.5;
    }
    & > :first-child {
        grid-column: 1 / -1;
        display: flex;
        gap: 1em;
        align-items: center;
        & > :nth-child(2) {
            font-weight: bold;
        }
    }
    & > span:nth-of-type(odd) {
        font-weight: bold;
        white-space: nowrap;
    }
    & > span:nth-of-type(even) {
        opacity: 0.9;
    }
    & > span span {
        font-size: smaller;
    }

    & > a {
        margin-top: 0.5em;
        grid-column: 1 / -1;
        padding: 1em;
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
