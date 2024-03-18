<script lang="ts">
import Cart from '$/lib/components/Cart.svelte';
import { applyAction, enhance } from '$app/forms';
import { page } from '$app/stores';
import { fade, slide } from 'svelte/transition';
import type { ActionData, PageData } from './$types';
import LoadingSpinner from '$/lib/components/LoadingSpinner.svelte';

let loading = false;

export let data: PageData;
export let form: ActionData;

let htmlForm: HTMLFormElement;

let shippingOption = data.cart?.shipping_methods?.[0]?.shipping_option_id ?? data.shippingOptions?.[0]?.id;

$: shippingCost = data.shippingOptions.find((s) => s.id === shippingOption)?.amount || 0;

let invoiceAddress = data.cart?.billing_address ? 'separateAddress' : 'asDelivery';
let formValid = false;

let width: number;
let height: number;

$: portrait = width < height;

let portraitCartExpanded = false;
</script>

<svelte:window bind:innerWidth="{width}" bind:innerHeight="{height}" />

<div class="content" class:loading="{loading}">
    <div>
        <form
            method="POST"
            id="data-form"
            bind:this="{htmlForm}"
            on:input="{() => {
                formValid = htmlForm.checkValidity();
            }}"
            use:enhance="{async () => {
                loading = true;
                return async ({ update, result }) => {
                    await update({ reset: false });
                    loading = false;
                    await applyAction(result);
                };
            }}">
            <div class="columns">
                <h3 class="wide">Delivery</h3>
                <label for="email" class="wide" class:field-error="{form?.fieldErrors?.email}">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        id="email"
                        on:input="{() => {
                            if (form?.fieldErrors?.email) form.fieldErrors.email = '';
                        }}"
                        value="{data.cart?.email ?? ''}" />
                    <span class="hint">Email</span>
                </label>
                <label for="first_name" class:field-error="{form?.fieldErrors?.first_name}">
                    <input
                        name="first_name"
                        type="text"
                        placeholder="Name"
                        required
                        id="first_name"
                        on:input="{() => {
                            if (form?.fieldErrors?.first_name) form.fieldErrors.first_name = '';
                        }}"
                        value="{data.cart?.shipping_address?.first_name ?? ''}" />
                    <span class="hint">Name</span>
                </label>
                <label for="last_name" class:field-error="{form?.fieldErrors?.last_name}">
                    <input
                        name="last_name"
                        type="text"
                        placeholder="Last Name"
                        required
                        id="last_name"
                        on:input="{() => {
                            if (form?.fieldErrors?.last_name) form.fieldErrors.last_name = '';
                        }}"
                        value="{data.cart?.shipping_address?.last_name ?? ''}" />
                    <span class="hint">Last Name</span>
                </label>
                <label for="company" class="wide" class:field-error="{form?.fieldErrors?.company}">
                    <input
                        name="company"
                        type="text"
                        placeholder="Company (Optional)"
                        id="company"
                        on:input="{() => {
                            if (form?.fieldErrors?.company) form.fieldErrors.company = '';
                        }}"
                        value="{data.cart?.shipping_address?.company ?? ''}" />
                    <span class="hint">Company (Optional)</span>
                </label>
                <label for="address" class="wide" class:field-error="{form?.fieldErrors?.address}">
                    <input
                        name="address"
                        type="text"
                        placeholder="Address"
                        required
                        id="address"
                        on:input="{() => {
                            if (form?.fieldErrors?.address) form.fieldErrors.address = '';
                        }}"
                        value="{data.cart?.shipping_address?.address_1 ?? ''}" />
                    <span class="hint">Address</span>
                </label>
                <label for="zip" class:field-error="{form?.fieldErrors?.zip}">
                    <input
                        name="zip"
                        type="text"
                        placeholder="Zip"
                        required
                        id="zip"
                        on:input="{() => {
                            if (form?.fieldErrors?.zip) form.fieldErrors.zip = '';
                        }}"
                        value="{data.cart?.shipping_address?.postal_code ?? ''}" />
                    <span class="hint">Zip</span>
                </label>
                <label for="city" class:field-error="{form?.fieldErrors?.city}">
                    <input
                        name="city"
                        type="text"
                        placeholder="City"
                        required
                        id="city"
                        on:input="{() => {
                            if (form?.fieldErrors?.city) form.fieldErrors.city = '';
                        }}"
                        value="{data.cart?.shipping_address?.city ?? ''}" />
                    <span class="hint">City</span>
                </label>
                <label for="phone" class="wide" class:field-error="{form?.fieldErrors?.phone}">
                    <input
                        name="phone"
                        type="tel"
                        placeholder="Phone (Optional)"
                        id="phone"
                        on:input="{() => {
                            if (form?.fieldErrors?.phone) form.fieldErrors.phone = '';
                        }}"
                        value="{data.cart?.shipping_address?.phone ?? ''}" />
                    <span class="hint">Phone (Optional)</span>
                </label>
                <input type="hidden" name="country" value="de" />
            </div>
            <fieldset>
                {#if data.shippingOptions.length > 0}
                    <h3>Shipping method</h3>
                {/if}
                {#each data.shippingOptions as option (option.id)}
                    {#if !option.admin_only}
                        <label for="shipping-{option.id}" class="checkbox-label">
                            <input
                                type="radio"
                                name="shippingOption"
                                id="shipping-{option.id}"
                                value="{option.id}"
                                required
                                bind:group="{shippingOption}" />
                            <span>{option.name}</span>
                            <span>{(option.price_incl_tax || 0) / 100}€</span>
                        </label>
                    {/if}
                {/each}
            </fieldset>
            <fieldset>
                <h3>Invoice Adress</h3>
                <label for="asDelivery" class="checkbox-label">
                    <input
                        type="radio"
                        name="invoiceAddress"
                        id="asDelivery"
                        value="asDelivery"
                        required
                        on:change="{() => {
                            setTimeout(() => {
                                formValid = htmlForm.checkValidity();
                            }, 500);
                        }}"
                        bind:group="{invoiceAddress}" />
                    <span>Same as delivery address</span>
                </label>
                <label for="separateAddress" class="checkbox-label">
                    <input
                        type="radio"
                        name="invoiceAddress"
                        id="separateAddress"
                        value="separateAddress"
                        required
                        on:change="{() => {
                            setTimeout(() => {
                                formValid = htmlForm.checkValidity();
                            }, 500);
                        }}"
                        bind:group="{invoiceAddress}" />
                    <span>Separate address</span>
                </label>
                {#if invoiceAddress === 'separateAddress'}
                    <div class="columns" transition:slide>
                        <label
                            for="invoice-first_name"
                            class:field-error="{form?.fieldErrors?.['invoice-first_name']}">
                            <input
                                id="invoice-first_name"
                                name="invoice-first_name"
                                type="text"
                                placeholder="Name"
                                required
                                value="{data.cart?.billing_address?.first_name}" />
                            <span class="hint">Name</span>
                        </label>
                        <label
                            for="invoice-last_name"
                            class:field-error="{form?.fieldErrors?.['invoice-last_name']}">
                            <input
                                id="invoice-last_name"
                                name="invoice-last_name"
                                type="text"
                                placeholder="Last Name"
                                required
                                value="{data.cart?.billing_address?.last_name ?? ''}" />
                            <span class="hint">Last Name</span>
                        </label>
                        <label
                            for="invoice-company"
                            class="wide"
                            class:field-error="{form?.fieldErrors?.['invoice-company']}">
                            <input
                                id="invoice-company"
                                name="invoice-company"
                                type="text"
                                placeholder="Company (Optional)"
                                class="wide"
                                value="{data.cart?.billing_address?.company ?? ''}" />
                            <span class="hint">Company (Optional)</span>
                        </label>
                        <label
                            for="invoice-address"
                            class="wide"
                            class:field-error="{form?.fieldErrors?.['invoice-address']}">
                            <input
                                id="invoice-address"
                                name="invoice-address"
                                type="text"
                                placeholder="Address"
                                required
                                class="wide"
                                value="{data.cart?.billing_address?.address_1 ?? ''}" />
                            <span class="hint">Address</span>
                        </label>
                        <label for="invoice-zip" class:field-error="{form?.fieldErrors?.['invoice-zip']}">
                            <input
                                id="invoice-zip"
                                name="invoice-zip"
                                type="text"
                                placeholder="Zip"
                                required
                                value="{data.cart?.billing_address?.postal_code ?? ''}" />
                            <span class="hint">Zip</span>
                        </label>
                        <label for="invoice-city" class:field-error="{form?.fieldErrors?.['invoice-city']}">
                            <input
                                id="invoice-city"
                                name="invoice-city"
                                type="text"
                                placeholder="City"
                                required
                                value="{data.cart?.billing_address?.city ?? ''}" />
                            <span class="hint">City</span>
                        </label>
                        <input type="hidden" name="invoice-country" value="de" />
                    </div>
                {/if}
            </fieldset>
            {#if form?.error?.message}
                <span transition:slide class="error">{form?.error?.message}</span>
            {/if}
        </form>
        <div class="rhs">
            {#if portrait}
                <button
                    class="expand-cart-button"
                    on:click="{(e) => {
                        e.preventDefault();
                        portraitCartExpanded = !portraitCartExpanded;
                    }}">
                    {portraitCartExpanded ? 'Hide' : 'Show'} Cart
                </button>
            {/if}
            {#if !portrait || portraitCartExpanded}
                <div transition:slide>
                    <Cart disableMinWidth="{true}">
                        <div slot="total"></div>
                    </Cart>
                </div>
            {/if}
            <div class="total">
                <h4>Subtotal:</h4>
                <span>{($page.data.cart?.subtotal || 0) / 100}€</span>
                <span>Shipping:</span>
                <span>{shippingCost === 0 ? 'Free' : `${shippingCost / 100}€`}</span>
                <h3>Total:</h3>
                <span>{(($page.data.cart?.subtotal || 0) + shippingCost) / 100}€</span>
            </div>
            <button
                form="data-form"
                class="primary"
                type="submit"
                disabled="{loading ||
                    !formValid ||
                    (!shippingOption && !data.cart?.items.some((i) => i.is_giftcard))}">
                {#if loading}
                    <LoadingSpinner size="1.3em" ringWidth="0.25em" />
                {:else}
                    Next
                {/if}
            </button>
        </div>
    </div>
</div>

<style lang="postcss">
.content {
    width: 100%;
    display: grid;
    justify-content: center;
    padding: 1em;

    @media (orientation: landscape) {
        &::after {
            content: '';
            position: absolute;
            top: 1em;
            bottom: 1em;
            right: 50%;
            width: 1px;
            opacity: 0.25;
            background-color: var(--textColor);
        }
    }
    &.loading {
        pointer-events: none;
    }
    & > div {
        display: grid;
        gap: 2em;

        @media (orientation: portrait) {
            grid-template-columns: 100%;
            width: 100%;
            overflow-x: hidden;
        }

        grid-template-columns: repeat(2, 1fr);
        @media (orientation: landscape) {
            width: min(100%, 1800px);
            & > * {
                width: 100%;
            }
        }
    }
}

.rhs {
    display: grid;
    gap: 1em;
    height: fit-content;
}

form {
    display: grid;
    gap: 2em;
    padding: 1em;
    height: fit-content;

    @media (orientation: portrait) {
        padding: 0;
        overflow-x: hidden;
    }

    & label {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: auto min-content;
        align-items: center;
        position: relative;
        isolation: isolate;

        & > * {
            grid-column: 1;
            grid-row: 1;
        }

        & input:not([type='radio']) {
            width: 100%;
        }

        & input:focus-visible + .hint,
        & input:not(:placeholder-shown) + .hint {
            opacity: 1;
            font-size: 0.75em;
            translate: 0 -1.75em;
            background-color: var(--backgroundColor);
        }

        & .hint {
            pointer-events: none;
            width: fit-content;
            user-select: none;
            margin: 0 0.5em;
            padding: 0 0.5em;
            opacity: 0.5;
            transition: all var(--transitionDuration) ease;
            border-radius: 0.5em;
        }
    }
}

.wide {
    grid-column: 1 / -1;
}

.columns {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    gap: 1em;
    padding: 0;

    @media (orientation: portrait) {
        overflow-x: hidden;
    }
}

input::placeholder {
    visibility: hidden;
    opacity: 0;
}

label.field-error {
    & input {
        border-color: red;
    }
    & span + span {
        color: red;
        grid-row: 2;
        padding: 0.5em 0;
    }
}

fieldset {
    outline: none;
    border: none;
    padding: 0;
    display: grid;
    grid-auto-flow: row;
    gap: 1rem;
    width: 100%;
    & .checkbox-label {
        position: relative;
        display: flex;
        gap: 1em;
        align-items: center;
        isolation: isolate;

        & span {
            position: relative;
            padding: 0;
        }

        & span + span {
            margin-left: auto;
            opacity: 0.75;
        }

        &:hover,
        &:focus-visible {
            & input[type='radio']:not(:checked)::before {
                background-color: color-mix(in srgb, var(--textColor), transparent 75%);
            }
        }
    }
}

.total {
    display: grid;
    grid-template-columns: auto min-content;
    width: 100%;
    gap: 1em;
    align-items: center;

    & span {
        font-weight: bold;
    }
    & > :nth-child(even) {
        text-align: end;
    }
}

.expand-cart-button {
    display: grid;
    place-items: center;
    width: 100%;
}

.error {
    color: rgb(207, 0, 0);
    font-weight: bold;
}
</style>
