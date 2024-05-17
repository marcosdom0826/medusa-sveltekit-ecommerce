<script lang="ts">
import { t } from '$/lib/i18n';
import Cart from '$/lib/components/Cart.svelte';
import { applyAction, enhance } from '$app/forms';
import { page } from '$app/stores';
import { fade, slide } from 'svelte/transition';
import type { ActionData, PageData } from './$types';
import LoadingSpinner from '$/lib/components/LoadingSpinner.svelte';
import InputField from '$/lib/components/InputField.svelte';
import MdiEyeOutline from '~icons/mdi/eye-outline';
import MdiEyeOffOutline from '~icons/mdi/eye-off-outline';

let loading = $state(false);

const {
    data,
    form
}: {
    data: PageData;
    form: ActionData & {
        fieldErrors?: Record<string, unknown>;
    };
} = $props();

let htmlForm: HTMLFormElement;

let shippingOption = $state(
    data.cart?.shipping_methods?.[0]?.shipping_option_id ?? data.shippingOptions?.[0]?.id
);

const shippingCost = $derived(data.shippingOptions.find((s) => s.id === shippingOption)?.amount || 0);

let invoiceAddress = $state(
    data.cart?.billing_address || data.customer?.billing_address?.address_1 ? 'separateAddress' : 'asDelivery'
);
let formValid = $state(false);

$effect(() => {
    formValid = htmlForm.checkValidity();
});

let width: number = $state(0);
let height: number = $state(0);

const portrait = $derived(width < height);

let portraitCartExpanded = $state(false);

let createAccount = $state(true);
let pw = $state('');
let repeatPw = $state('');
let passwordShown = $state(false);

const formData = $state({
    email: data.cart?.email ?? '',
    first_name:
        data.cart?.shipping_address?.first_name ?? data.customer?.shipping_addresses?.[0]?.first_name ?? '',
    last_name:
        data.cart?.shipping_address?.last_name ?? data.customer?.shipping_addresses?.[0]?.last_name ?? '',
    company: data.cart?.shipping_address?.company ?? data.customer?.shipping_addresses?.[0]?.company ?? '',
    address:
        data.cart?.shipping_address?.address_1 ?? data.customer?.shipping_addresses?.[0]?.address_1 ?? '',
    zip:
        data.cart?.shipping_address?.postal_code ?? data.customer?.shipping_addresses?.[0]?.postal_code ?? '',
    city: data.cart?.shipping_address?.city ?? data.customer?.shipping_addresses?.[0]?.city ?? '',
    phone: data.cart?.shipping_address?.phone ?? data.customer?.phone ?? '',

    invoice_first_name:
        data.cart?.billing_address?.first_name ?? data.customer?.billing_address?.first_name ?? '',
    invoice_last_name:
        data.cart?.billing_address?.last_name ?? data.customer?.billing_address?.last_name ?? '',
    invoice_company: data.cart?.billing_address?.company ?? data.customer?.billing_address?.company ?? '',
    invoice_address: data.cart?.billing_address?.address_1 ?? data.customer?.billing_address?.address_1 ?? '',
    invoice_zip: data.cart?.billing_address?.postal_code ?? data.customer?.billing_address?.postal_code ?? '',
    invoice_city: data.cart?.billing_address?.city ?? data.customer?.billing_address?.city ?? ''
});

$inspect(data.customer);
$inspect(form?.error);
</script>

<svelte:window bind:innerWidth="{width}" bind:innerHeight="{height}" />

<div class="content" class:loading="{loading}">
    <div>
        <form
            method="POST"
            id="data-form"
            action="?/next"
            bind:this="{htmlForm}"
            oninput="{() => {
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
                {#if !data.customer}
                    <span style="text-align: end;">Already registered?</span>
                    <a href="/account/login?redirect=checkout" class="button login-link">Login</a>
                {/if}
                <h3 class="wide">Delivery</h3>
                <div class="wide">
                    <InputField
                        field="email"
                        label="Email"
                        type="email"
                        bind:value="{formData.email}"
                        required
                        fieldErrors="{form?.fieldErrors}" />
                </div>
                <InputField
                    field="first_name"
                    label="Name"
                    type="text"
                    bind:value="{formData.first_name}"
                    required
                    fieldErrors="{form?.fieldErrors}" />
                <InputField
                    field="last_name"
                    label="Last Name"
                    type="text"
                    bind:value="{formData.last_name}"
                    required
                    fieldErrors="{form?.fieldErrors}" />
                <div class="wide">
                    <InputField
                        field="company"
                        label="Company (Optional)"
                        type="text"
                        bind:value="{formData.company}"
                        fieldErrors="{form?.fieldErrors}" />
                </div>
                <div class="wide">
                    <InputField
                        field="address"
                        label="Address"
                        required
                        type="text"
                        bind:value="{formData.address}"
                        fieldErrors="{form?.fieldErrors}" />
                </div>
                <InputField
                    field="zip"
                    label="Zip"
                    required
                    type="text"
                    bind:value="{formData.zip}"
                    fieldErrors="{form?.fieldErrors}" />
                <InputField
                    field="city"
                    label="City"
                    required
                    type="text"
                    bind:value="{formData.city}"
                    fieldErrors="{form?.fieldErrors}" />
                <div class="wide">
                    <InputField
                        field="phone"
                        label="Phone (Optional)"
                        type="tel"
                        bind:value="{formData.phone}"
                        fieldErrors="{form?.fieldErrors}" />
                </div>
                <input type="hidden" name="country" value="de" />
                {#if !data.customer}
                    <div class="wide">
                        <label for="createAccount" class="checkbox-label">
                            <input
                                type="checkbox"
                                name="createAccount"
                                id="createAccount"
                                bind:checked="{createAccount}"
                                onchange="{() => {
                                    setTimeout(() => {
                                        formValid = htmlForm.checkValidity();
                                    }, 500);
                                }}" />
                            <span>Create account</span>
                        </label>
                    </div>
                    {#if createAccount}
                        <div class="wide" transition:slide style="display: grid; gap: 1em;">
                            <InputField
                                autocomplete="new-password"
                                field="password"
                                label="Password"
                                type="{passwordShown ? 'text' : 'password'}"
                                required
                                bind:value="{pw}">
                            </InputField>
                            <InputField
                                autocomplete="new-password"
                                field="repeat-password"
                                label="Repeat Password"
                                type="{passwordShown ? 'text' : 'password'}"
                                required
                                fieldErrors="{pw !== repeatPw
                                    ? { 'repeat-password': 'Passwords do not match' }
                                    : undefined}"
                                bind:value="{repeatPw}">
                                <button
                                    type="button"
                                    class="show-pw-button"
                                    onclick="{() => (passwordShown = !passwordShown)}">
                                    {#if passwordShown}
                                        <div transition:fade|local="{{ duration: 200 }}">
                                            <MdiEyeOffOutline />
                                        </div>
                                    {:else}
                                        <div transition:fade|local="{{ duration: 200 }}">
                                            <MdiEyeOutline />
                                        </div>
                                    {/if}
                                </button>
                            </InputField>
                        </div>
                    {/if}
                {/if}
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
                                onchange="{() => {
                                    setTimeout(() => {
                                        formValid = htmlForm.checkValidity();
                                    }, 500);
                                }}"
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
                        onchange="{() => {
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
                        onchange="{() => {
                            setTimeout(() => {
                                formValid = htmlForm.checkValidity();
                            }, 500);
                        }}"
                        bind:group="{invoiceAddress}" />
                    <span>Separate address</span>
                </label>
            </fieldset>
            {#if invoiceAddress === 'separateAddress'}
                <div class="columns" transition:slide>
                    <InputField
                        field="invoice-first_name"
                        required
                        type="text"
                        label="Name"
                        fieldErrors="{form?.fieldErrors}"
                        bind:value="{formData.invoice_first_name}" />
                    <InputField
                        field="invoice-last_name"
                        required
                        type="text"
                        label="Last Name"
                        fieldErrors="{form?.fieldErrors}"
                        bind:value="{formData.invoice_last_name}" />
                    <div class="wide">
                        <InputField
                            field="invoice-company"
                            type="text"
                            label="Company (Optional)"
                            fieldErrors="{form?.fieldErrors}"
                            bind:value="{formData.invoice_company}" />
                    </div>
                    <div class="wide">
                        <InputField
                            field="invoice-address"
                            type="text"
                            label="Address"
                            required
                            fieldErrors="{form?.fieldErrors}"
                            bind:value="{formData.invoice_address}" />
                    </div>
                    <InputField
                        field="invoice-zip"
                        type="text"
                        label="Zip"
                        required
                        fieldErrors="{form?.fieldErrors}"
                        bind:value="{formData.invoice_zip}" />
                    <InputField
                        field="invoice-city"
                        type="text"
                        label="City"
                        required
                        fieldErrors="{form?.fieldErrors}"
                        bind:value="{formData.invoice_city}" />
                    <input type="hidden" name="invoice-country" value="de" />
                </div>
            {/if}
        </form>
        <div class="rhs">
            {#if portrait}
                <button
                    class="expand-cart-button"
                    onclick="{(e) => {
                        e.preventDefault();
                        portraitCartExpanded = !portraitCartExpanded;
                    }}">
                    {portraitCartExpanded ? 'Hide' : 'Show'} Cart
                </button>
            {/if}
            {#if !portrait || portraitCartExpanded}
                <div transition:slide>
                    <Cart disableMinWidth="{true}">
                        {#snippet total()}
                            <div></div>
                        {/snippet}
                    </Cart>
                </div>
            {/if}
            <div class="total">
                <h4>Subtotal:</h4>
                <!-- TODO: remove when eslint-plugin-svelte is updated -->
                <!-- eslint-disable-next-line svelte/valid-compile -->
                <span>{($page.data.cart?.subtotal || 0) / 100}€</span>

                <div class="discounts wide columns">
                    {#each data.cart?.discounts || [] as discount (discount.id)}
                        <span style="text-align: start;">{discount.code}</span>
                        <span style="text-align: end;">-{discount.rule.value}%</span>
                    {/each}
                    {#each data.cart?.gift_cards || [] as giftCard (giftCard.id)}
                        <span style="text-align: start;">{giftCard.code}</span>
                        <span style="text-align: end;">-{giftCard.balance / 100}€</span>
                    {/each}
                </div>
                <span>Shipping:</span>
                <span>{shippingCost === 0 ? 'Free' : `${shippingCost / 100}€`}</span>
                <h3>Total:</h3>
                <span>{(($page.data.cart?.total || 0) + shippingCost) / 100}€</span>
            </div>
            <button
                form="data-form"
                class="primary"
                type="submit"
                disabled="{loading ||
                    !formValid ||
                    (!data.customer && createAccount && (pw !== repeatPw || pw === '')) ||
                    (!shippingOption && !data.cart?.items.some((i) => i.is_giftcard))}">
                {#if loading}
                    <LoadingSpinner size="1.3em" ringWidth="0.25em" />
                {:else if data.customer}
                    Continue
                {:else if createAccount}
                    Continue and create account
                {:else}
                    Continue as Guest
                {/if}
            </button>
            {#if (form?.error as Record<string, unknown>)?.message}
                <span
                    transition:slide="{{
                        duration: 200
                    }}"
                    class="error">
                    <!-- eslint-disable-next-line svelte/valid-compile -->
                    {$t((form?.error as Record<string, string>)?.message || form?.error as string || '')}
                </span>
            {/if}
            <hr style="opacity: 0.25;" />
            <form
                class="code-form"
                method="POST"
                id="code-form"
                action="?/addCode"
                use:enhance="{async () => {
                    loading = true;
                    return async ({ update, result }) => {
                        await update({ reset: false });
                        loading = false;
                        await applyAction(result);
                    };
                }}">
                <h3 class="wide">Discount Code</h3>
                <InputField
                    field="code"
                    label="Discount code / Voucher"
                    type="text"
                    required
                    value="{''}"
                    fieldErrors="{form?.fieldErrors}" />
                <button class="discount-button"> Add code</button>
            </form>
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

.discount-button {
    display: grid;
    place-items: center;
    white-space: nowrap;
    width: 100%;
    background-color: var(--backgroundColor);
    border: 1px solid color-mix(in srgb, var(--textColor), transparent 50%);
    color: color-mix(in srgb, var(--textColor), transparent 20%);
    padding: 0 1em;
    cursor: pointer;
    transition: all var(--transitionDuration) ease;

    &:hover {
        box-shadow:
            0 0.5em 0.5em var(--shadowColor),
            0 0 0 var(--shadowColor);
        border: 1px solid var(--textColor);
        color: var(--textColor);
    }
}

.code-form {
    display: grid;
    grid-template-columns: auto min-content;
    gap: 1em;
    padding: 0em;
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

    align-items: center;

    @media (orientation: portrait) {
        overflow-x: hidden;
    }
}

input::placeholder {
    visibility: hidden;
    opacity: 0;
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
    & > :nth-of-type(even):span {
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

.discounts {
    opacity: 0.6;
    & > * {
        font-weight: normal !important;
    }
}

.checkbox-label {
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
        & input[type='checkbox']:not(:checked)::before {
            background-color: color-mix(in srgb, var(--textColor), transparent 75%);
        }
    }
}

.show-pw-button {
    position: absolute;
    right: 0;
    top: 0;
    padding: 0.25em;
    border: none;
    background-color: transparent;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: none;
    opacity: 0.5;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    place-items: center;
    & > * {
        grid-column: 1;
        grid-row: 1;
    }
    &:hover,
    &:focus-visible {
        opacity: 1;
    }
}

.login-link {
    display: grid;
    place-items: center;
    height: fit-content;
    padding: 0.5em;
}
</style>
