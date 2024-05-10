<script lang="ts">
/* eslint-disable prettier/prettier */
import { t } from '$/lib/i18n';
import type { ActionData, PageData } from './$types';
import ProductImageView from '$/lib/components/ProductImageView.svelte';
import type { ProductOptionValue, ProductVariant } from '$/lib/medusa';
import ProductBar from '$/lib/components/ProductBar.svelte';
import { applyAction, enhance } from '$app/forms';
import { fade, slide } from 'svelte/transition';
import LoadingSpinner from '$/lib/components/LoadingSpinner.svelte';
import { cartDrawerOpen } from '$/lib/stores/cartDrawer';

const { data, form }: { data: PageData; form: ActionData } = $props();

let loading = $state(false);

const findOutOfStockOptions = (): Record<string, Record<string, boolean>> => data.product.is_giftcard
    ? ({})
    : data.product?.variants?.reduce(
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
    data.product.is_giftcard ? true : variant ? (variant.allow_backorder || variant.inventory_quantity !== 0) : nonVariant;

const outOfStockOptions = $derived.by(findOutOfStockOptions);
let selectedOptions: Record<string, ProductOptionValue[]> = $state({});

const selectedVariant = $derived.by(() => variantForOptions(selectedOptions) || data.product.variants[0]);

const price = $derived((selectedVariant?.calculated_price ?? 0) / 100);
const originalPrice = $derived((selectedVariant?.original_price ?? 0) / 100);

const selectionValid = $derived(
    variantForOptions(selectedOptions) !== undefined
        && Object.keys(selectedOptions).length >= Object.keys(data.productOptions).length
        && (selectedVariant.inventory_quantity !== 0 || selectedVariant.allow_backorder || data.product.is_giftcard)
);

const hasReducedVariant = (options: ProductOptionValue[]) => data.product.variants.some(
    (v) => options.some((o) => o.variant_id === v.id) && v?.calculated_price !== v?.original_price
);

/* eslint-enable prettier/prettier */
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
            <form
                method="POST"
                use:enhance="{() => {
                    loading = true;
                    return async ({ update, result }) => {
                        await update({ reset: false });
                        loading = false;
                        if (result.type !== 'failure') {
                            // TODO: remove when eslint-plugin-svelte is updated
                            // eslint-disable-next-line svelte/valid-compile
                            $cartDrawerOpen = true;
                        }
                        selectedOptions = {};
                        await applyAction(result);
                    };
                }}">
                <div class="option-select">
                    {#each Object.entries(data.productOptions || {}) as [optionCategory, optionGroup] (optionCategory)}
                        <div>
                            <h3>{optionCategory}</h3>
                            <fieldset>
                                {#each Object.entries(optionGroup) as [optionName, optionValues] (optionName)}
                                    <label>
                                        <input
                                            disabled="{outOfStockOptions?.[optionCategory]?.[optionName] ||
                                                !isOrderAllowed(
                                                    variantForOptions({
                                                        ...selectedOptions,
                                                        [optionCategory]: optionValues
                                                    }),
                                                    true
                                                )}"
                                            type="radio"
                                            name="{optionName}"
                                            value="{optionValues}"
                                            bind:group="{selectedOptions[optionCategory]}" />
                                        <span
                                            >{data.product.is_giftcard
                                                ? Number.parseInt(optionName) / 100 + ' €'
                                                : optionName}</span>

                                        {#if hasReducedVariant(optionValues)}
                                            <div class="reduced-marker"></div>
                                        {/if}
                                    </label>
                                {/each}
                            </fieldset>
                        </div>
                    {/each}
                    <input type="hidden" name="variant" value="{selectedVariant.id}" />
                </div>
                {#if !data.product.is_giftcard}
                    <div class="stock-container" transition:slide|fade>
                        {#if (selectedVariant.inventory_quantity ?? 0) <= 0 && selectedVariant.allow_backorder}
                            <div class="low-stock" transition:slide>On Backorder</div>
                        {/if}
                        {#if (selectedVariant.inventory_quantity ?? 0) < 10 && (selectedVariant.inventory_quantity ?? 0) > 0}
                            <div class="low-stock" transition:slide>
                                <span>{$t('low_stock')}</span>
                            </div>
                        {/if}
                    </div>
                {:else}
                    <input type="hidden" name="variant" value="{selectedVariant.id}" />
                {/if}
                <div class="add-to-cart">
                    {#if form?.error}
                        <div class="error" transition:slide>
                            {$t(form.error?.code as string || 'Unknown error')}
                        </div>
                    {/if}
                    <button class="primary" disabled="{!selectionValid || loading}">
                        {#if loading}
                            <div transition:fade|local="{{ duration: 230 }}" class="loading">
                                <LoadingSpinner size="1.3em" ringWidth="0.25em" />
                            </div>
                        {:else if selectionValid}
                            <span transition:fade|local="{{ duration: 200 }}">Add to cart</span>
                        {:else}
                            <span transition:fade|local="{{ duration: 200 }}">Please select size</span>
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
    overflow-x: hidden;
    max-width: 100%;
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
    max-width: 100%;
    display: grid;
    height: fit-content;
    gap: 1em;

    & > div {
        max-width: 100%;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
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
        color: rgb(207, 0, 0);
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
    grid-template-columns: repeat(auto-fit, minmax(8ch, 1fr));
    gap: 1rem;
    overflow-x: hidden;
    max-width: 100%;

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

        .reduced-marker {
            height: 50%;
            aspect-ratio: 1;
            z-index: 0;
            position: absolute;
            inset: 0;
            background: rgb(207, 0, 0);
            border: 2px solid var(--textColor);
            clip-path: polygon(0 100%, 100% 0, 0 0);
            transition: border var(--transitionDuration) ease;
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
                &:hover,
                &:focus-visible {
                    box-shadow: none;
                    &::after {
                        background: transparent;
                    }
                }
            }

            &:hover,
            &:focus-visible {
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

.error {
    color: rgb(207, 0, 0);
    font-weight: bold;
    padding: 1em 0;
}
</style>
