<script lang="ts">
import { page } from '$app/stores';
import { fade } from 'svelte/transition';
import CartItem from './CartItem.svelte';
</script>

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

<style lang="postcss">
.cart {
    display: grid;
    place-items: center;
    padding: 1em;
    gap: 2em;
    &:has(.empty) {
        height: 100%;
    }
}

.empty {
    display: grid;
    place-items: center;
    padding: 1em;
    height: 100%;
}
</style>
