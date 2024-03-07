<script lang="ts">
/* eslint-disable prettier/prettier */
import { t } from '$/lib/i18n';
import type { PageData } from './$types';
import ProductImageView from '$/lib/components/ProductImageView.svelte';
import type { ProductOptionValue, ProductVariant } from '$/lib/medusa';
    import ProductBar from '$/lib/components/ProductBar.svelte';
    import { enhance } from '$app/forms';
    import { fade, slide } from 'svelte/transition';
    import LoadingSpinner from '$/lib/components/LoadingSpinner.svelte';
    import { cartDrawerOpen } from '$/lib/stores/cartDrawer';

export let data: PageData;

let loading = false;

const findOutOfStockOptions = (): Record<string, Record<string, boolean>> => data.product?.variants?.reduce(
    (variantAcc, variant) => variant.options?.reduce(
        (optionAcc, option) => {
            const group = data.product.options?.find((o) => o.id === option.option_id);
            if (group) {
                if (!optionAcc[group.title]) {
                    optionAcc[group.title] = {};
                }
                const variantInStock = (variant.inventory_quantity || 0) > 0;
                const allowsBackOrder = variant.allow_backorder;
                if (optionAcc[group.title][option.value] === undefined) {
                    optionAcc[group.title][option.value] = (
                        !variantInStock && !allowsBackOrder
                    );
                } else {
                    optionAcc[group.title][option.value] = (
                        optionAcc[group.title][option.value] && (!variantInStock && !allowsBackOrder)
                    );
                }
            }
            return optionAcc;
        },
        variantAcc
    ) || variantAcc,
    {} as Record<string, Record<string, boolean>>
);

const variantForOptions = (options: Record<string, ProductOptionValue[]>) => {
    const optionValues = Object.values(options).flat(1);
    return data.product.variants.find(
        (variant) => variant.options?.every(
            (vo) => optionValues.find(
                (ov) => ov.id === vo.id
            )
        )
    );
};
const isOrderAllowed = (variant: ProductVariant | undefined, nonVariant?: boolean) =>
    variant ? (variant.allow_backorder || variant.inventory_quantity !== 0) : nonVariant;

const outOfStockOptions = findOutOfStockOptions();
let selectedOptions: Record<string, ProductOptionValue[]> = {};

$: selectedVariant = variantForOptions(selectedOptions) || data.product.variants[0];

$: price = (selectedVariant?.calculated_price ?? 0) / 100;
$: originalPrice = (selectedVariant?.original_price ?? 0) / 100;

$: selectionValid = Object.keys(selectedOptions).length >= Object.keys(data.productOptions).length
    && (selectedVariant.inventory_quantity !== 0 || selectedVariant.allow_backorder);

</script>

<div class="wrapper">
    <section class="product-content">
        <div class="images-wrapper sticky-desktop">
            <ProductImageView product="{data.product}" />
        </div>

        <div class="cart-area">
            <div class="product-info">
                <h2>{data.product.title}</h2>
                <h3>{data.product.subtitle || ''}</h3>
                <p>{data.product.description || ''}</p>
            </div>
            <div class="pricing">
                <span class="{originalPrice !== price ? 'reduced price' : 'price'}">{price} €</span>
                {#if originalPrice !== price}
                <span class="original price" transition:fade>{originalPrice} €</span>
                {/if}
                <!-- {#if originalPrice !== price}
                <span class="reduced">-{Math.round(((originalPrice - price) / originalPrice) * 100)}%</span>
                {/if} -->
            </div>
            <form method="POST" use:enhance={() => {
                loading = true;
                return async ({ update }) => {
                    await update({ reset: false });
                    loading = false;
                    $cartDrawerOpen = true;
                    selectedOptions = {};
                };
            }}>
                <div class="option-select">
                    {#each Object.entries(data.productOptions || {}) as [optionCategory, optionGroup] (optionCategory)}
                        <div>
                            <h3>{optionCategory}</h3>
                            <fieldset>
                                {#each Object.entries(optionGroup) as [optionName, optionValues] (optionName)}
                                    <label>
                                        <input
                                            disabled={
                                                outOfStockOptions?.[optionCategory]?.[optionName] ||
                                                !isOrderAllowed(
                                                    variantForOptions({ ...selectedOptions, [optionCategory]: optionValues }),
                                                    true
                                                )
                                            }
                                            type="radio"
                                            name="{optionName}"
                                            value="{optionValues}"
                                            bind:group="{selectedOptions[optionCategory]}" />
                                        <span>{optionName}</span>
                                    </label>
                                {/each}
                            </fieldset>
                        </div>
                    {/each}
                    <input type="hidden" name="variant" value="{selectedVariant.id}" />
                </div>
                <div class="stock-container">
                    {#if (selectedVariant.inventory_quantity ?? 0) <= 0 && (selectedVariant.allow_backorder)}
                        <div class="low-stock" transition:slide>
                            On Backorder
                        </div>
                    {/if}
                    {#if (selectedVariant.inventory_quantity ?? 0) < 10 && (selectedVariant.inventory_quantity ?? 0) > 0}
                        <div class="low-stock" transition:slide>
                            <span>{$t('low_stock')}</span>
                        </div>
                    {/if}
                </div>
                <div class="add-to-cart">
                    <button class="primary" disabled="{!selectionValid || loading}" class:loading={loading}>
                    {#if loading}
                        <span transition:fade class="loading"><LoadingSpinner size="1.3em" ringWidth="0.25em" /></span>
                    {:else}
                        <span transition:fade>{
                            selectionValid
                                ? 'Add to cart'
                                : 'Please select size'
                        }</span>
                    {/if}</button>
                </div>
            </form>
        </div>
    </section>
    <section class="related">
        <h2>You might also like</h2>
        <ProductBar products="{data.relatedProducts.filter((p) => p.id !== data.product.id)}" scrollable />
    </section>
</div>

<style lang="postcss">
.wrapper {
    display: grid;
    place-items: center;
    height: 100%;
}

.related {
    grid-column: 1 / -1;
    display: grid;
    place-items: center;
    gap: 2rem;
    padding: 2rem;
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
    width: min(100%, 1800px);
    height: 100%;
    position: relative;
}

.product-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.cart-area {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    & form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
}

.images-wrapper {
    width: 100%;
    overflow: hidden;
    padding: 1em;
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

.option-select {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    & > div {
        display: grid;
        flex-direction: column;
        gap: 1em;
    }
}

.low-stock {
    opacity: 0.8;
    display: grid;
    grid-template-rows: 1fr;
    transition: grid-template-rows var(--transitionDuration);
    & > * {
        overflow: hidden;
    }
}

.pricing {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    & > .reduced {
        color: rgb(207, 0, 0);;
    }
}
.price {
    font-size: 1.8em;
    font-weight: bold;
    &.original {
        text-decoration: line-through;
        font-weight: normal;
    }
}

fieldset {
    border: 1px solid transparent;
    display: grid;
    grid-auto-flow: column;
    gap: 1rem;

    & label {
        position: relative;
        padding: 1em;
        display: grid;
        place-items: center;
        isolation: isolate;

        & span {
            user-select: none;
            z-index: 1;
            pointer-events: none;
            font-weight: bold;
            transition: color var(--transitionDuration) ease;
        }

        & input[type='radio'] {
            background-color: transparent;
            appearance: none;
            border: none;
            border: 2px solid var(--textColor);
            border-radius: 2px;
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;

            &::before {
                opacity: 0;
                content: '';
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                border-radius: 0;
                clip-path: polygon(0 0, 0 0, 100% 100%, 0% 100%);
                background: var(--textColor);
                transition:
                    background var(--transitionDuration) ease,
                    opacity var(--transitionDuration) ease;
            }
            &:disabled {
                opacity: 0.5;
                & + span {
                    opacity: 0.5;
                    color: var(--textColor) !important;
                }
                &::before {
                    opacity: 0.25;
                }
                &:hover,&:focus-visible {
                    box-shadow: none;
                    &::after {
                        background: transparent;
                    }
                }
            }

            &:hover,&:focus-visible {
                &::after {
                    background: hsla(0, 0%, 100%, var(--effectAlpha));
                }
            }

            &::after {
                content: '';
                position: absolute;
                inset: 0;
                transition:
                    background var(--transitionDuration) ease,
                    opacity var(--transitionDuration) ease;
            }
            &:checked {
                appearance: none;
                &::after {
                    background: var(--textColor);
                }
            }
        }

        & input[type='radio']:checked + span {
            color: var(--inverseTextColor);
        }
    }
}

.add-to-cart {
    & button {
        width: 100%;

        & > * {
            grid-column: 1 / -1;
            grid-row: 1 / -1;
        }
    }
}
</style>
