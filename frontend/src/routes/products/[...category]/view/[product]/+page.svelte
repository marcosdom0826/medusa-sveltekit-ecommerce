<script lang="ts">
/* eslint-disable prettier/prettier */
import type { PageData } from './$types';
import ProductImageView from '$/lib/components/ProductImageView.svelte';
import type { ProductOptionValue, ProductVariant } from '$/lib/medusa';

export let data: PageData;

const findOutOfStockOptions = (): Record<string, Record<string, boolean>> => data.product.variants.reduce(
    (variantAcc, variant) => variant.options?.reduce(
        (optionAcc, option) => {
            const group = data.product.options?.find((o) => o.id === option.option_id);
            if (group) {
                if (!optionAcc[group.title]) {
                    optionAcc[group.title] = {};
                }
                const variantInStock = variant.inventory_quantity !== 0;
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
const selectedOptions: Record<string, ProductOptionValue[]> = {};

</script>

<div class="wrapper">
    <section class="product-content">
        <div class="images-wrapper sticky-desktop">
            <ProductImageView product="{data.product}" />
        </div>

        <div class="checkout-area">
            <div class="product-info">
                <h2>{data.product.title}</h2>
                <h3>{data.product.subtitle}</h3>
                <p>{data.product.description}</p>
            </div>
            <div class="option-select">
                {#each Object.entries(data.productOptions || {}) as [optionCategory, optionGroup] (optionCategory)}
                    <div>
                        <h3>{optionCategory}</h3>
                        <fieldset>
                            {#each Object.entries(optionGroup) as [optionName, optionValues] (optionName)}
                                <label>
                                    <input
                                        disabled={
                                            outOfStockOptions[optionCategory][optionName] ||
                                            !isOrderAllowed(variantForOptions({ ...selectedOptions, [optionCategory]: optionValues }), true)
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
            </div>
            <div class="checkout">
                <h3>Checkout</h3>
                <p>Checkout area here</p>
            </div>
        </div>
    </section>
    <section class="dummy">
        <h1>Placeholder</h1>
        <p>Landing content here</p>
    </section>
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
    height: 600px;
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
    width: min(100%, 1800px);
    height: 100%;
    position: relative;
}

.product-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.checkout-area {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
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
        display: flex;
        flex-direction: column;
        gap: 1rem;
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
            cursor: pointer;

            &::before {
                opacity: 0;
                content: '';
                position: absolute;
                inset: 0;
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
                &:hover {
                    box-shadow: none;
                    &::after {
                        background: transparent;
                    }
                }
            }

            &:hover {
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

</style>
