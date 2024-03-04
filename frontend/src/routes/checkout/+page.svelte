<script lang="ts">
import Cart from '$/lib/components/Cart.svelte';
import { enhance } from '$app/forms';
import { page } from '$app/stores';
import { slide } from 'svelte/transition';
let loading = false;
$: console.log(loading);

let paymentOption = 'paypal';
let invoiceAddress = 'asDelivery';

let width: number;
let height: number;

$: portrait = width < height;

let portraitCartExpanded = false;
</script>

<svelte:window bind:innerWidth="{width}" bind:innerHeight="{height}" />

<div class="wrapper">
    <div>
        <form
            method="POST"
            use:enhance="{async () => {
                loading = true;
                return async ({ update }) => {
                    await update({ reset: false });
                    loading = false;
                };
            }}">
            <div class="columns">
                <h3 class="wide">Delivery</h3>
                <label for="email" class="wide">
                    <input name="email" type="email" placeholder="Email" required id="email" />
                    <span class="hint">Email</span>
                </label>
                <label for="name">
                    <input name="name" type="text" placeholder="Name" required id="name" />
                    <span class="hint">Name</span>
                </label>
                <label for="surname">
                    <input name="surname" type="text" placeholder="Surname" required id="surname" />
                    <span class="hint">Surname</span>
                </label>
                <label for="company" class="wide">
                    <input name="company" type="text" placeholder="Company (Optional)" id="company" />
                    <span class="hint">Company (Optional)</span>
                </label>
                <label for="address" class="wide">
                    <input name="address" type="text" placeholder="Address" required id="address" />
                    <span class="hint">Address</span>
                </label>
                <label for="zip">
                    <input name="zip" type="text" placeholder="Zip" required id="zip" />
                    <span class="hint">Zip</span>
                </label>
                <label for="city">
                    <input name="city" type="text" placeholder="City" required id="city" />
                    <span class="hint">City</span>
                </label>
                <label for="phone" class="wide">
                    <input name="phone" type="tel" placeholder="Phone (Optional)" id="phone" />
                    <span class="hint">Phone (Optional)</span>
                </label>
            </div>
            <fieldset>
                <h3>Payment</h3>
                <span>All payments are encrypted and secure</span>
                <label for="paypal" class="checkbox-label">
                    <input
                        type="radio"
                        name="paymentOption"
                        id="paypal"
                        value="paypal"
                        required
                        bind:group="{paymentOption}" />
                    <span>Paypal</span>
                </label>
                <label for="prepayment" class="checkbox-label">
                    <input
                        type="radio"
                        name="paymentOption"
                        id="prepayment"
                        value="prepayment"
                        required
                        bind:group="{paymentOption}" />
                    <span>Prepayment</span>
                </label>
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
                        bind:group="{invoiceAddress}" />
                    <span>Separate address</span>
                </label>
                {#if invoiceAddress === 'separateAddress'}
                    <div class="columns" transition:slide>
                        <label for="invoice-name">
                            <input
                                id="invoice-name"
                                name="invoice-name"
                                type="text"
                                placeholder="Name"
                                required />
                            <span class="hint">Name</span>
                        </label>
                        <label for="invoice-surname">
                            <input
                                id="invoice-surname"
                                name="invoice-surname"
                                type="text"
                                placeholder="Surname"
                                required />
                            <span class="hint">Surname</span>
                        </label>
                        <label for="invoice-company" class="wide">
                            <input
                                id="invoice-company"
                                name="invoice-company"
                                type="text"
                                placeholder="Company (Optional)"
                                class="wide" />
                            <span class="hint">Company (Optional)</span>
                        </label>
                        <label for="invoice-address" class="wide">
                            <input
                                id="invoice-address"
                                name="invoice-address"
                                type="text"
                                placeholder="Address"
                                required
                                class="wide" />
                            <span class="hint">Address</span>
                        </label>
                        <label for="invoice-zip">
                            <input
                                id="invoice-zip"
                                name="invoice-zip"
                                type="text"
                                placeholder="Zip"
                                required />
                            <span class="hint">Zip</span>
                        </label>
                        <label for="invoice-city">
                            <input
                                id="invoice-city"
                                name="invoice-city"
                                type="text"
                                placeholder="City"
                                required />
                            <span class="hint">City</span>
                        </label>
                        <label for="invoice-phone" class="wide">
                            <input
                                id="invoice-phone"
                                name="invoice-phone"
                                type="tel"
                                placeholder="Phone (Optional)"
                                class="wide" />
                            <span class="hint">Phone (Optional)</span>
                        </label>
                    </div>
                {/if}
            </fieldset>
            {#if portrait}
                <div class="wide" style="width: 100%; overflow-x: hidden;">
                    <button
                        class="expand-cart-button"
                        on:click="{(e) => {
                            e.preventDefault();
                            portraitCartExpanded = !portraitCartExpanded;
                        }}">
                        {portraitCartExpanded ? 'Hide' : 'Show'} Cart
                    </button>
                    {#if portraitCartExpanded}
                        <div transition:slide>
                            <Cart disableMinWidth="{true}" disableEmpty="{true}">
                                <div slot="total"></div>
                            </Cart>
                        </div>
                    {/if}
                </div>
                <div class="total">
                    <h3>Total:</h3>
                    <span>{($page.data.cart?.total || 0) / 100}€</span>
                </div>
            {/if}
            <button class="primary">Pay</button>
        </form>
        {#if !portrait}
            <aside>
                <Cart disableMinWidth="{true}" disableEmpty="{true}">
                    <div class="total" slot="total">
                        <h3>Total:</h3>
                        <span>{($page.data.cart?.total || 0) / 100}€</span>
                    </div>
                </Cart>
            </aside>
        {/if}
    </div>
</div>

<style lang="postcss">
.wrapper {
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
            & > :first-child {
                width: 100%;
            }
            & > :last-child {
                height: fit-content;
                width: 100%;
            }
        }
    }
}

form {
    display: grid;
    gap: 2em;
    padding: 1em;
    min-height: 100%;

    @media (orientation: portrait) {
        padding: 0;
        overflow-x: hidden;
    }

    & label {
        display: flex;
        align-items: center;
        position: relative;
        isolation: isolate;

        & input:not([type='radio']) {
            width: 100%;
        }

        & input:focus-visible + .hint,
        & input:not(:placeholder-shown) + .hint {
            opacity: 1;
            font-size: 0.75em;
            translate: 0 -1.75em;
        }

        & .hint {
            position: absolute;
            left: 0.5em;
            pointer-events: none;
            user-select: none;
            padding: 0 0.5em;
            opacity: 0.5;
            background-color: var(--backgroundColor);
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
}

.expand-cart-button {
    display: grid;
    place-items: center;
    width: 100%;
}
</style>
