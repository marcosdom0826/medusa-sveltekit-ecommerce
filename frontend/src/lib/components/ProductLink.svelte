<script lang="ts">
/* eslint-disable prettier/prettier */
import { t } from '$/lib/i18n';
import type { PricedProduct, ProductCategory } from '$lib/medusa';
import { page } from '$app/stores';
export let product: PricedProduct;

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

$: price = (product.variants?.[0]?.calculated_price ?? 0) / 100;
$: originalPrice = (product.variants?.[0]?.original_price ?? 0) / 100;

$: reducedPercent = (() => {
    if (originalPrice !== price) {
        return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
})();

$: categoryUrl = (() => {
    if (product.is_giftcard) {
        return 'giftcards/';
    }
    if (product.categories?.[0]?.handle) {
        const res = recurseParentCategories(product.categories?.[0]);
        return res ? `${res}/` : '';
    }
    return '';
})();

$: stock = product.is_giftcard
    ? 9999
    : product.variants
        ?.reduce(
            (acc, v) => acc + (v.inventory_quantity || 0),
            0
        ) ?? 0;
/* eslint-enable prettier/prettier */
</script>

<a href="/products/{categoryUrl}view/{product.handle}">
    <div>
        <picture>
            <source type="image/png" srcset="{product.thumbnail}" />
            <img src="{product.thumbnail}" alt="{product.title}" />
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
        <span class="{originalPrice !== price ? 'reduced price' : 'price'}">{price}€</span>
        {#if originalPrice !== price}
            <span class="original price">{originalPrice}€</span>
        {/if}
    </div>
</a>

<style lang="postcss">
a {
    color: var(--textColor);
    text-decoration: none;
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto min-content;
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

.original {
    text-decoration: line-through;
}

.reduced {
    color: #ff0015;
}

.price {
    font-size: 1.05em;
    font-weight: bold;
}

.reduced-percent {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #ff0015;
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
