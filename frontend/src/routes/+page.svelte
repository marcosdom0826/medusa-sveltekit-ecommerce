<script lang="ts">
import ProductBar from '$/lib/components/ProductBar.svelte';
import type { PageData } from './$types';
import background from '$assets/background.svg?url';

export let data: PageData;
$: products = data.products;

let y = 0;
</script>

<svelte:window bind:scrollY="{y}" />

<div class="content">
    <section class="hero">
        <div>
            <div>
                <img src="{background}" alt="background" style="translate: 0 {y / 2}px;" />
            </div>
        </div>
        <div>
            <h1>Placeholder</h1>
            <p>Hero content here</p>
        </div>
    </section>
    <section class="fresh-products">
        <h2>Fresh</h2>
        <ProductBar products="{products}" scrollable />
    </section>
</div>

<style lang="postcss">
.content {
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
    height: calc(100dvh - var(--header-height));
    width: 100%;
    display: grid;
    place-items: center;
    position: relative;

    & > :first-child {
        position: absolute;
        inset: 0;
        overflow: hidden;
        & div {
            margin-top: calc(var(--header-height) * -1);
            position: absolute;
            inset: 0;
        }
        & img {
            object-fit: cover;
            width: 100%;
            height: 100%;
            /* mix-blend-mode: hard-light; */
        }
    }

    & > div {
        display: grid;
        place-items: center;
    }

    & > :last-child {
        isolation: isolate;
    }
}
</style>
