<script lang="ts">
import ProductLink from '$lib/components/ProductLink.svelte';
import type { PricedProduct } from '../medusa';
export let products: PricedProduct[] = [];
export let scrollable = true;
</script>

<div class="product-bar {scrollable ? 'scrollable' : ''}">
    <div style="--productCount: {products.length};" class="{scrollable ? 'scrollable' : ''}">
        {#each products as product, idx}
            {#key idx}
                <ProductLink product="{product}" />
            {/key}
        {/each}
    </div>
</div>

<style lang="postcss">
.product-bar {
    width: 100%;
    overflow: hidden;
}

.product-bar > div {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 360px));
    grid-template-rows: auto;
    grid-auto-rows: 0;
    overflow: hidden;
    grid-column-gap: 2rem;
    place-content: center;
    &.scrollable {
        display: grid;
        grid-template-columns: repeat(var(--productCount), minmax(160px, 360px));
        grid-template-rows: 1fr;
        overflow-x: auto;
        grid-column-gap: 2rem;
        place-content: baseline;
    }
}
</style>
