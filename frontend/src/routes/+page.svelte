<script lang="ts">
import ProductBar from '$/lib/components/ProductBar.svelte';
import type { PageData } from './$types';
// import needed for css
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import background from '$assets/background.svg';

export let data: PageData;
$: products = data.products;
</script>

<div class="center">
    <div class="hero">
        <div>
            <h1>Placeholder</h1>
            <p>Hero content here</p>
        </div>
    </div>
    <div class="fresh-products">
        <h2>Fresh</h2>
        <ProductBar products="{products}" scrollable />
    </div>
</div>

<style lang="postcss">
.center {
    position: relative;
    justify-items: center;
    display: grid;
    height: 100%;
    width: 100%;
    grid-template-rows: auto min-content;
    gap: 2rem;
}

.fresh-products {
    padding: 1rem;
    justify-items: center;
    display: grid;
    height: 100%;
    width: fit-content;
    grid-template-rows: auto min-content;
    gap: 2rem;
}

.hero {
    background: url('$assets/background.svg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;
    @media (prefers-motion-reduce: reduce) {
        background-attachment: scroll;
    }

    background-blend-mode: multiply;

    height: calc(100dvh - var(--header-height));
    width: 100%;
    display: grid;
    place-items: center;

    & > div {
        display: grid;
        place-items: center;
    }
}
</style>
