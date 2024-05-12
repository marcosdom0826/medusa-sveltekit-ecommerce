<script lang="ts">
import InputField from '$/lib/components/InputField.svelte';
import type { PageData } from './$types';
import { enhance, applyAction } from '$app/forms';
const { data }: { data: PageData } = $props();

let editDetails = $state(false);
let editAdresses = $state(false);

let detailsForm: HTMLFormElement | undefined = $state();
let detailFormValid = $state(false);
let detailFormLoading = $state(false);

let adressesForm: HTMLFormElement | undefined = $state();
let adressesFormValid = $state(false);
let addressesFormLoading = $state(false);

let useSeparateInvoiceAddress = $state(!!data.customer?.billing_address?.address_1);
</script>

<div class="wrapper">
    <div>
        {#if editDetails}
            <form
                class="base-details"
                id="base-details"
                method="POST"
                action="?/editDetails"
                bind:this="{detailsForm}"
                oninput="{() => {
                    detailFormValid = detailsForm?.checkValidity() || false;
                }}"
                use:enhance="{async () => {
                    detailFormLoading = true;
                    return async ({ update, result }) => {
                        await update({ reset: false });
                        detailFormLoading = false;
                        await applyAction(result);
                        if (result.type !== 'failure') {
                            editDetails = false;
                        }
                    };
                }}">
                <h2 class="wide">Personal Details</h2>
                <InputField
                    field="first_name"
                    label="First Name"
                    required
                    type="string"
                    value="{data.customer?.first_name}" />
                <InputField
                    field="last_name"
                    label="Last Name"
                    required
                    type="string"
                    value="{data.customer?.last_name}" />
                <div class="wide">
                    <InputField
                        field="email"
                        label="Email"
                        type="email"
                        required
                        value="{data.customer?.email}" />
                </div>
                <div class="wide">
                    <InputField
                        field="phone"
                        label="Phone (Optional)"
                        type="tel"
                        value="{data.customer?.phone}" />
                </div>
                <button onclick="{() => (editDetails = false)}">Cancel</button>
                <button
                    type="submit"
                    class="primary"
                    form="base-details"
                    disabled="{!detailFormValid || detailFormLoading}">Save</button>
            </form>
        {:else}
            <div class="base-details">
                <h2 class="wide">Personal Details</h2>
                <span class="wide">{data.customer?.first_name} {data.customer?.last_name}</span>
                <span>Email:</span>
                <span>{data.customer?.email}</span>
                <span>Phone:</span>
                {#if data.customer?.phone}
                    <span>{data.customer?.phone}</span>
                {:else}
                    <span style="opacity: 0.5;">(Not specified)</span>
                {/if}
                <button class="wide" onclick="{() => (editDetails = true)}">Edit</button>
            </div>
        {/if}
        {#if editAdresses}
            <form
                class="addresses-detail"
                id="addresses-detail"
                method="POST"
                action="?/editAddresses"
                bind:this="{adressesForm}"
                oninput="{() => {
                    adressesFormValid = adressesForm?.checkValidity() || false;
                }}"
                use:enhance="{async () => {
                    addressesFormLoading = true;
                    return async ({ update, result }) => {
                        await update({ reset: false });
                        addressesFormLoading = false;
                        await applyAction(result);
                        if (result.type !== 'failure') {
                            editAdresses = false;
                        }
                    };
                }}">
                <h2 class="wide">Addresses</h2>
                <h3 class="wide">Shipping Address</h3>
                <InputField
                    field="shipping_first_name"
                    label="Name"
                    type="text"
                    required
                    value="{data.customer?.shipping_addresses?.[0]?.first_name}" />
                <InputField
                    field="shipping_last_name"
                    label="Last Name"
                    type="text"
                    required
                    value="{data.customer?.shipping_addresses?.[0]?.last_name}" />
                <div class="wide">
                    <InputField
                        field="shipping_company"
                        label="Company"
                        type="text"
                        value="{data.customer?.shipping_addresses?.[0]?.company}" />
                </div>
                <div class="wide">
                    <InputField
                        field="shipping_address_1"
                        label="Address"
                        type="text"
                        required
                        value="{data.customer?.shipping_addresses?.[0]?.address_1}" />
                </div>
                <InputField
                    field="shipping_postal_code"
                    label="Postal Code"
                    type="text"
                    required
                    value="{data.customer?.shipping_addresses?.[0]?.postal_code}" />
                <InputField
                    field="shipping_city"
                    label="City"
                    type="text"
                    required
                    value="{data.customer?.shipping_addresses?.[0]?.city}" />
                <input type="hidden" name="shipping_country" value="de" />
                <label for="separateInvoiceAddress" class="checkbox-label wide">
                    <input
                        type="checkbox"
                        name="separateInvoiceAddress"
                        id="separateInvoiceAddress"
                        bind:checked="{useSeparateInvoiceAddress}" />
                    <span>Separate Invoice address</span>
                </label>
                {#if useSeparateInvoiceAddress}
                    <h3 class="wide">Invoice Address</h3>
                    <InputField
                        field="invoice_first_name"
                        label="Name"
                        type="text"
                        value="{data.customer?.billing_address?.first_name}"
                        required />
                    <InputField
                        field="invoice_last_name"
                        label="Last Name"
                        type="text"
                        value="{data.customer?.billing_address?.last_name}"
                        required />
                    <div class="wide">
                        <InputField
                            field="invoice_company"
                            label="Company"
                            type="text"
                            value="{data.customer?.billing_address?.company}" />
                    </div>
                    <div class="wide">
                        <InputField
                            field="invoice_address_1"
                            label="Address"
                            type="text"
                            value="{data.customer?.billing_address?.address_1}" />
                    </div>
                    <InputField
                        field="invoice_postal_code"
                        label="Postal Code"
                        type="text"
                        value="{data.customer?.billing_address?.postal_code}" />
                    <InputField
                        field="invoice_city"
                        label="City"
                        type="text"
                        value="{data.customer?.billing_address?.city}" />
                    <input type="hidden" name="invoice_country" value="de" />
                {/if}
                <button onclick="{() => (editAdresses = false)}">Cancel</button>
                <button
                    type="submit"
                    class="primary"
                    form="addresses-detail"
                    disabled="{!adressesFormValid || addressesFormLoading}">Save</button>
            </form>
        {:else}
            <div class="addresses-detail">
                <h2>Address{data.customer?.billing_address?.address_1 ? 'es' : ''}</h2>
                <div class="address">
                    {#if data.customer?.billing_address?.address_1}
                        <h3>Shipping Address</h3>
                    {/if}
                    {#if !data.customer?.shipping_addresses?.[0]?.address_1}
                        <span style="opacity: 0.5;">No address yet</span>
                    {:else}
                        <span>
                            {data.customer?.shipping_addresses?.[0]?.first_name}
                            {data.customer?.shipping_addresses?.[0]?.last_name}
                        </span>
                        <span>
                            {data.customer?.shipping_addresses?.[0]?.company}
                        </span>
                        <span>
                            {data.customer?.shipping_addresses?.[0]?.address_1}
                        </span>
                        {#if data.customer?.shipping_addresses?.[0]?.address_2}
                            <span>
                                {data.customer?.shipping_addresses?.[0]?.address_2}
                            </span>
                        {/if}
                        <span>
                            {data.customer?.shipping_addresses?.[0]?.postal_code}
                            {data.customer?.shipping_addresses?.[0]?.city}
                        </span>
                    {/if}
                </div>
                {#if data.customer?.billing_address?.address_1}
                    <div class="address">
                        <h3>Invoice Address</h3>
                        {#if !data.customer?.billing_address?.address_1}
                            <span style="opacity: 0.5;">No address yet</span>
                        {:else}
                            <span>
                                {data.customer?.billing_address?.first_name}
                                {data.customer?.billing_address?.last_name}
                            </span>
                            <span>
                                {data.customer?.billing_address?.company}
                            </span>
                            <span>
                                {data.customer?.billing_address?.address_1}
                            </span>
                            {#if data.customer?.billing_address?.address_2}
                                <span>
                                    {data.customer?.billing_address?.address_2}
                                </span>
                            {/if}
                            <span>
                                {data.customer?.billing_address?.postal_code}
                                {data.customer?.billing_address?.city}
                            </span>
                        {/if}
                    </div>
                {/if}
                <button class="wide" onclick="{() => (editAdresses = true)}">Edit</button>
            </div>
        {/if}
        <hr />
        <a href="/account/change-password" class="button">Change Password</a>
    </div>
</div>

<style lang="postcss">
.wrapper {
    display: grid;
    justify-items: center;
    height: fit-content;
    gap: 0.5em;
    padding: 2rem;
    & > div {
        display: grid;
        gap: 2em;
        min-width: min(100%, 450px);
    }
}

.addresses-detail {
    grid-row: 2;
    grid-column: 1;

    &:is(form) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1em;
    }

    .address {
        margin-bottom: 1em;
        display: grid;
        grid-template-columns: min-content min-content;
        white-space: nowrap;
        & > span {
            grid-column: 1 / -1;
            opacity: 0.8;
        }
    }
    h2 {
        margin-bottom: 0.5em;
        padding: 0.5em 0;
        width: 100%;
    }
    h3 {
        margin-bottom: 0.25em;
    }
}

.base-details {
    display: grid;
    gap: 0.5em;
    grid-row: 1;
    grid-column: 1;

    grid-template-columns: min-content auto;
    &:is(form) {
        grid-template-columns: 1fr 1fr;
        gap: 1em;
    }
    & > span:nth-of-type(even) {
        font-weight: bold;
    }

    & > span:nth-of-type(1) {
        font-size: 1.5em;
    }
}

.wide {
    grid-column: 1 / -1;
    padding-bottom: 0.5em;
    width: 100%;
}
button {
    display: grid;
    place-items: center;
    padding: 0.5em;
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

a {
    display: grid;
    place-items: center;
}
</style>
