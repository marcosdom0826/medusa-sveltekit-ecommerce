<script lang="ts">
import { page } from '$app/stores';
import { fade, slide } from 'svelte/transition';
import CartItem from './CartItem.svelte';
import type { CartItem as LineItem } from '../medusa';
import type { Snippet } from 'svelte';

const {
    disableMinWidth = false,
    disableEmpty = false,
    disableEdit = false,
    items = undefined as LineItem[] | undefined,
    total = undefined as Snippet | undefined
} = $props();

const sortItems = () =>
    // TODO: fix after eslint-plugin-svelte is updated
    // eslint-disable-next-line svelte/valid-compile
    [...((items ?? $page.data.cart?.items) || [])]?.sort((a: LineItem, b: LineItem) =>
        a.title.localeCompare(b.title)
    );
const sortedItems = $derived(sortItems());
</script>

<div class="wrapper" style="{disableMinWidth ? '' : 'min-width: min(28em, 100dvw);'}">
    {#if (sortedItems?.length || 0) === 0}
        <div transition:fade class="empty">
            <h2>Your cart is empty</h2>
        </div>
    {:else}
        <div class="cart">
            {#each sortedItems as item (item.id)}
                <div transition:slide|local>
                    <CartItem item="{item}" disableEmpty="{disableEmpty}" disableEdit="{disableEdit}" />
                </div>
            {/each}
        </div>
    {/if}
    <div>
        {#if total}
            {@render total()}
        {:else if (sortedItems?.length || 0) > 0}
            <h3 transition:slide>Total: {($page.data.cart?.subtotal || 0) / 100}€</h3>
            {#if $page.data.cart?.subtotal !== $page.data.cart?.total}
                <span style="opacity: 0.5;">Discounts are calculated at checkout step</span>
            {/if}
            <a transition:slide class="button primary" href="/checkout">Checkout</a>
        {/if}
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

    & > :global(*) {
        margin: 1em 0;
        position: relative;
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
