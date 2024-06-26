<script lang="ts">
/* eslint-disable prettier/prettier */
import { t } from '$/lib/i18n';
import type { PricedProduct, ProductCategory } from '$lib/medusa';
import { page } from '$app/stores';


const { product }: { product: PricedProduct } = $props();

// TODO: remove after after eslint-plugin-svelte is updated
// eslint-disable-next-line svelte/valid-compile
const categories: Record<string, ProductCategory> = $page.data.categoriesByHandle || {};
const recurseParentCategories = (category: ProductCategory | undefined | null, rest = ''): string => {
    if (!category) {
        return rest;
    }
    const maybeParent = categories[category.handle].parent_category?.handle;
    if (maybeParent) {
        return recurseParentCategories(categories[maybeParent], `${maybeParent}/${rest || category.handle}`);
    }
    return rest || category.handle;
};

const price = $derived((product.variants?.[0]?.calculated_price ?? 0) / 100);
const originalPrice = $derived((product.variants?.[0]?.original_price ?? 0) / 100);

const reducedPercent = $derived.by((() => {
    if (originalPrice !== price) {
        return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
}));

const categoryUrl = $derived.by(() => {
    if (product.is_giftcard) {
        return 'giftcards/';
    }
    if (product.categories
        ?.[0]?.handle) {
        const res = recurseParentCategories([...product.categories]
            ?.sort((a, b) => a.rank - b.rank)
            ?.[0]
        );
        return res ? `${res}/` : '';
    }
    return '';
});

const stock = $derived(product.is_giftcard
    ? 9999
    : product.variants
        ?.reduce(
            (acc, v) =>
            {
                const quantity = (v.inventory_quantity || 0);
                if (quantity < 0) {
                    return acc;
                }
                return acc + (v.inventory_quantity || 0);
            },
            0
        ) ?? 0
);
/* eslint-enable prettier/prettier */
</script>

<a href="/products/{categoryUrl}view/{product.handle}" style="view-transition-name: product-{product.id};">
    <div>
        <picture>
            <source
                srcset="{product.thumbnail?.replaceAll('localhost', $page.url.host.replace(/:\d*$/g, ''))}" />
            <img
                src="{product.thumbnail?.replaceAll('localhost', $page.url.host.replace(/:\d*$/g, ''))}"
                alt="{product.title}" />
        </picture>
        {#if reducedPercent > 0}
            <span class="reduced-percent">-{reducedPercent}%</span>
        {/if}
        {#if stock < 10 && stock > 0}
            <span class="stock">{$t('low_stock')}</span>
        {/if}
        {#if stock === 0}
            <span class="stock">{$t('out_of_stock')}</span>
        {/if}
    </div>
    <div>
        <span class="title">{product.title}</span>
        <span class="subtitle">{product.subtitle || ' '}</span>
        {#if !product.is_giftcard}
            <span class="{originalPrice !== price ? 'reduced price' : 'price'}">{price}€</span>
            {#if originalPrice !== price}
                <span class="original price">{originalPrice}€</span>
            {/if}
        {/if}
    </div>
</a>

<style lang="postcss">
a {
    color: var(--textColor);
    text-decoration: none;
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: min-content auto;
    & > :first-child {
        position: relative;
        aspect-ratio: 1 / 1.33;
        overflow: hidden;
    }
    & > :last-child {
        display: flex;
        flex-wrap: wrap;
        column-gap: 1em;
        padding: 0.25em;
        align-items: end;
    }
}

picture,
img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 0.75rem;
}

.title {
    width: 100%;
    font-size: 1.25em;
    font-weight: bold;
}
.subtitle {
    width: 100%;
    min-height: 1.5em;
}

.original {
    text-decoration: line-through;
}

.reduced {
    color: rgb(207, 0, 0);
}

.price {
    font-size: 1.2em;
    font-weight: bold;
}

.reduced-percent {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: rgb(207, 0, 0);
    color: white;
    padding: 0.5em 1em !important;
    border-radius: 0 0.75em 0 0.75em;
    font-size: 1em;
    box-shadow: 0 0 3em 0.25em var(--shadowColor);
}

.stock {
    position: absolute;
    top: 2rem;
    left: 0;
    background-color: rgb(255, 255, 255);
    color: black;
    padding: 0.5em 2em !important;
    border-radius: 0 0.75em 0.75em 0;
    font-size: 1em;
    box-shadow: 0 0 3em 0.25em var(--shadowColor);
}
</style>
