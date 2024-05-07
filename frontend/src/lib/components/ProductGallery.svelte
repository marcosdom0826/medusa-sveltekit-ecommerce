<script lang="ts">
import ProductLink from '$lib/components/ProductLink.svelte';
import type { PricedProduct } from '../medusa';

const { products = [] }: { products: PricedProduct[] } = $props();
</script>

<div>
    {#each products as product (product.id)}
        <ProductLink product="{product}" />
    {/each}
</div>

<style lang="postcss">
div {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 360px));
    gap: 2rem;
    place-content: center;
    width: 100%;
}
</style>
