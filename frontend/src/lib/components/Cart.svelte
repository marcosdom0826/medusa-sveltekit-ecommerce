<script lang="ts">
import { page } from '$app/stores';
import { fade } from 'svelte/transition';
import CartItem from './CartItem.svelte';
</script>

<div class="wrapper">
    <div class="cart">
        {#if ($page.data.cart?.items?.length || 0) === 0}
            <div transition:fade class="empty">
                <h2>Your cart is empty</h2>
            </div>
        {:else}
            {#each $page.data.cart.items as item (item.id)}
                <CartItem item="{item}" />
            {/each}
        {/if}
    </div>
</div>

<style lang="postcss">
.wrapper {
    height: 100%;
    overflow: auto;
    scrollbar-gutter: stable;
}
.cart {
    display: grid;
    place-items: center;
    padding: 1em;
    gap: 2em;
    &:has(.empty) {
        height: 100%;
    }
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
    padding: 1em;
    height: 100%;
}
</style>
