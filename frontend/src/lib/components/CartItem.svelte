<script lang="ts">
import { enhance } from '$app/forms';
import type { CartItem } from '../medusa';
import RemoveIcon from '~icons/material-symbols/remove-shopping-cart-outline-rounded';
import { cartDrawerOpen } from '../stores/cartDrawer';
import LoadingSpinner from './LoadingSpinner.svelte';
import { fade, slide } from 'svelte/transition';
import { page } from '$app/stores';

export let item: CartItem;
export let disableEmpty = false;
export let disableEdit = false;
$: cartItems = $page.data.cart?.items || [];

$: isLastCartItem = cartItems.length === 1 && cartItems[0].id === item.id && cartItems[0].quantity === 1;

let formElement: HTMLFormElement;
let loading = false;

let error: string | false = '';
</script>

<form
    in:fade
    out:slide|fade
    use:enhance="{() => {
        loading = true;
        error = false;
        return async ({ update, result }) => {
            if ((result.status || 0) >= 299) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                error = result?.data.code;
            } else {
                error = false;
            }
            await update({ reset: false });
            loading = false;
            if (!Object.values($page.route).find((val) => val?.includes('checkout'))) {
                $cartDrawerOpen = true;
            }
        };
    }}"
    method="post"
    bind:this="{formElement}"
    action="/?/editCart">
    <picture>
        <source srcset="{item.thumbnail}" />
        <img src="{item.thumbnail}" alt="{item.title}" />
    </picture>
    <h3>{item.title}</h3>
    <span class="variant">{item.variant.title}</span>
    <span class="price">{item.unit_price / 100}€</span>
    <fieldset disabled="{loading || disableEdit}" class:invalid-anim="{error}">
        {#if !disableEdit}
            <button
                disabled="{loading || (disableEmpty && isLastCartItem)}"
                role="spinbutton"
                data-type="subtract"
                formaction="/?/decrementCartItem">-</button>
        {/if}
        <input
            disabled="{loading || disableEdit}"
            type="number"
            name="quantity"
            min="0"
            value="{item.quantity}"
            formaction="/?/editCart"
            on:keydown="{(e) => {
                if (e.key === 'Enter') {
                    if (disableEmpty && isLastCartItem) {
                        if (e.target) {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            e.target.value = 1;
                        }
                        return;
                    }
                    e.preventDefault();
                    formElement.requestSubmit();
                }
            }}"
            on:blur="{(e) => {
                if (disableEmpty && isLastCartItem) {
                    if (e.target) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        e.target.value = 1;
                    }
                    return;
                }
                formElement.requestSubmit();
            }}" />
        {#if !disableEdit}
            <button disabled="{loading}" role="spinbutton" data-type="add" formaction="/?/incrementCartItem"
                >+</button>
        {/if}
    </fieldset>
    <input type="hidden" name="id" value="{item.id}" />
    {#if !disableEdit}
        <button
            disabled="{loading || disableEmpty}"
            aria-roledescription="remove"
            data-type="remove"
            formaction="/?/removeCartItem"><RemoveIcon /></button>
    {/if}
    <span class="total-price">{(item.subtotal || item.unit_price) / 100}€</span>
    {#if loading}
        <div class="spinner" transition:fade>
            <LoadingSpinner size="1.3em" ringWidth="0.25em" />
        </div>
    {/if}
    {#if error}
        <p class="error" transition:slide>{error}</p>
    {/if}
</form>

<style lang="postcss">
form {
    width: 100%;
    display: grid;
    column-gap: 1em;
    row-gap: 0.5em;
    grid-template-columns: minmax(1em, 10em) auto auto auto;
    grid-template-rows: min-content min-content min-content auto;
    position: relative;
    align-items: center;

    & > * {
        grid-column: 2 / -1;
    }
    & .total-price {
        grid-column: 4;
        grid-row: 5;
        justify-self: end;
    }
    & button[data-type='remove'] {
        grid-column: 3;
        grid-row: 5;
        border: none;
        padding: 0.5em;
        display: grid;
        place-items: center;
        aspect-ratio: 1;
        &:hover,
        &:focus-visible {
            background: color-mix(in srgb, var(--textColor), transparent 85%);
        }
    }
    & fieldset {
        grid-column: 2;
        grid-row: 5;
        width: min-content;
    }
    & picture,
    & img {
        grid-column: 1 / 2;
        grid-row: 1 / span all;
        place-items: center;
        object-fit: cover;
        place-self: center;
        height: 100%;
        border-radius: 0.5em;
    }
    & > *:disabled {
        opacity: 0.5;
    }
}

.spinner {
    position: absolute;
    grid-column: 2 / span 1;
    grid-row: 5;
    inset: 0;
    display: grid;
    place-items: center;
}

.price {
    font-weight: bold;
}

.variant {
    font-weight: bold;
}

.total-price {
    font-weight: bold;
    font-size: 1.1em;
}

fieldset {
    display: grid;
    grid-template-columns: min-content auto min-content;
    padding: 0;
    margin: 0;
    border: 1px solid color-mix(in srgb, var(--textColor), transparent 50%);
    border-radius: 0.5em;
    place-items: center;
    overflow: hidden;
    & > * {
        border: none;
        box-shadow: none;
        &:is(:hover, :focus, :active) {
            border: none;
        }
    }
    &:not(:disabled):hover {
        border: 1px solid var(--textColor);
    }
    & button {
        width: 2.5em;
        height: 2.5em;
        padding: 0.5em;
        height: 100%;
        font-weight: bold;
        display: grid;
        border-radius: 0;
        place-items: center;
        &:hover {
            background: color-mix(in srgb, var(--textColor), transparent 85%);
        }
    }
}
input[type='number'] {
    appearance: textfield;
    width: 3.25em;
    text-align: center;
    padding: 0.5em;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        appearance: none;
        margin: 0;
    }
}

.invalid-anim {
    animation: error 0.5s ease-in-out alternate;
    animation-play-state: running;
}

.error {
    color: red;
    font-size: 0.8em;
    grid-column: 2 / -1;
    grid-row: 6;
}

@keyframes error {
    0% {
        border: 1px solid red;
    }
}
</style>
