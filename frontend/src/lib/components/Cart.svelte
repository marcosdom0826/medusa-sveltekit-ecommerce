<script lang="ts">
import { page } from '$app/stores';
import { fade, slide } from 'svelte/transition';
import CartItem from './CartItem.svelte';
import type { CartItem as LineItem } from '../medusa';

export let disableMinWidth = false;
export let disableEmpty = false;
export let disableEdit = false;
export let items = undefined as LineItem[] | undefined;

$: sortedItems =
    (items ?? $page.data.cart?.items)?.sort((a: LineItem, b: LineItem) => a.title.localeCompare(b.title)) ||
    [];
</script>

<div class="wrapper" style="{disableMinWidth ? '' : 'min-width: min(28em, 100dvw);'}">
    {#if (sortedItems?.length || 0) === 0}
        <div transition:fade class="empty">
            <h2>Your cart is empty</h2>
        </div>
    {:else}
        <div class="cart">
            {#each sortedItems as item (item.id)}
                <CartItem item="{item}" disableEmpty="{disableEmpty}" disableEdit="{disableEdit}" />
            {/each}
        </div>
    {/if}
    <div>
        <slot name="total">
            {#if (sortedItems?.length || 0) > 0}
                <h3 transition:slide>Total: {($page.data.cart?.subtotal || 0) / 100}€</h3>
                <a transition:slide class="button primary" href="/checkout">Checkout</a>
            {/if}
        </slot>
    </div>
</div>

<style lang="postcss">
.wrapper {
    height: 100%;
    display: grid;
    grid-template-rows: auto min-content;
    overflow: hidden;

    & > :first-child {
        overflow: auto;
        scrollbar-gutter: stable;
    }

    & > :last-child {
        padding: 1em;
        display: grid;
        gap: 1em;
        place-items: center;
        box-shadow: 0 -1px 1px 0 color-mix(in srgb, var(--textColor), transparent 75%);
        isolation: isolate;
    }
}
.cart {
    display: grid;
    padding: 1em;
    height: fit-content;
    grid-row: 1;
    grid-column: 1;

    & > :global(*) {
        margin: 1em 0;
        &::after {
            content: '';
            width: 100%;
            height: 1px;
            background: color-mix(in srgb, var(--textColor), transparent 75%);
            position: absolute;
            bottom: -1em;
        }
    }
    & > :global(*:last-child) {
        &::after {
            display: none;
        }
    }
}

.empty {
    display: grid;
    place-items: center;
    white-space: nowrap;
    height: 100%;
    pointer-events: none;
    grid-row: 1;
    grid-column: 1;
    padding: 2em 0;
}
</style>
