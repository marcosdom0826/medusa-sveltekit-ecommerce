<script lang="ts">
import ProductLink from '$lib/components/ProductLink.svelte';
import type { PricedProduct } from '../medusa';

export let products: PricedProduct[] = [];
</script>

<div>
    {#each products as product}
        <ProductLink product="{product}" />
    {/each}
</div>

<style lang="postcss">
div {
    white-space: pre;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 400px));
    gap: 2rem;
    place-content: center;
}
</style>
