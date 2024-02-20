<script lang="ts">
import type { PageData } from './$types';
import ProductImageView from '$/lib/components/ProductImageView.svelte';

export let data: PageData;
</script>

<div class="wrapper">
    <div class="product-content">
        <div class="images-wrapper sticky-desktop">
            <ProductImageView product="{data.product}" />
        </div>

        <div class="product-info">
            <h2>{data.product.title}</h2>
            <h3>{data.product.subtitle}</h3>
            <p>{data.product.description}</p>
        </div>
    </div>
    <div class="dummy">
        <h1>Placeholder</h1>
        <p>Landing content here</p>
    </div>
</div>

<style lang="postcss">
.wrapper {
    display: grid;
    place-items: center;
    height: 100%;
}

.dummy {
    grid-column: 1 / -1;
    display: grid;
    place-content: center;
    height: 6000px;
    background: firebrick;
    width: 100%;
}

.product-content {
    padding: 1rem;
    display: grid;
    @media (orientation: landscape) {
        grid-template-columns: 1fr 1fr;
    }
    @media (orientation: portrait) {
        grid-template-rows: min-content auto;
    }
    width: min(100%, 1600px);
    height: 100%;
    position: relative;
}

.product-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
}

.images-wrapper {
    width: 100%;
    overflow: hidden;
    @media (orientation: portrait) {
        max-height: 75dvh;
    }
    max-height: calc(100dvh - 1.5rem);
    border-radius: 0.5rem;
}

.sticky-desktop {
    @media (orientation: landscape) {
        position: sticky;
        top: 1em;
        align-self: start;
    }
}
</style>
