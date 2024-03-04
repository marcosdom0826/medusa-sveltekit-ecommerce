<script lang="ts">
import { page } from '$app/stores';
import { fade, slide } from 'svelte/transition';
import CartItem from './CartItem.svelte';

$: sortedItems = $page.data.cart?.items?.sort((a: CartItem, b: CartItem) => a.createdAt - b.createdAt) || [];

export let disableMinWidth = false;
export let disableEmpty = false;
</script>

<div class="wrapper" style="{disableMinWidth ? '' : 'min-width: min(28em, 100dvw);'}">
    <div>
        <div class="cart">
            {#if ($page.data.cart?.items?.length || 0) === 0}
                <div transition:fade class="empty">
                    <h2>Your cart is empty</h2>
                </div>
            {:else}
                {#each sortedItems as item (item.id)}
                    <CartItem item="{item}" disableEmpty="{disableEmpty}" />
                {/each}
            {/if}
        </div>
    </div>
    <div>
        <slot name="total">
            {#if ($page.data.cart?.items?.length || 0) > 0}
                <h3 transition:slide>Total: {($page.data.cart?.total || 0) / 100}€</h3>
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
        height: 100%;
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
    gap: 2em;

    & > :global(*) {
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
    padding: 4em;
    white-space: nowrap;
    height: 100%;
    position: absolute;
    inset: 0;
    pointer-events: none;
}
</style>
