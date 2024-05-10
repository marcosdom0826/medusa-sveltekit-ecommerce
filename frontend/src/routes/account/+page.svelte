<script lang="ts">
import type { PageData } from './$types';
const { data }: { data: PageData } = $props();
</script>

<div class="wrapper">
    <div>
        <div class="base-details">
            <h2 class="wide">Personal Details</h2>
            <span class="wide">{data.customer.first_name} {data.customer.last_name}</span>
            <span>Email:</span>
            <span>{data.customer.email}</span>
            <span>Phone:</span>
            {#if data.customer.phone}
                <span>{data.customer.phone}</span>
            {:else}
                <span style="opacity: 0.5;">(Not specified)</span>
            {/if}
        </div>
        <div class="addresses-detail">
            <h2>Addresses</h2>
            <div>
                <h3>Invoice Address</h3>
                {#if !data.customer.billing_address?.address_1}
                    <span style="opacity: 0.5;">No address yet</span>
                {:else}
                    <span>
                        {data.customer.billing_address?.first_name}
                        {data.customer.billing_address?.last_name}
                    </span>
                    <span>
                        {data.customer.billing_address?.company}
                    </span>
                    <span>
                        {data.customer.billing_address?.address_1}
                        {data.customer.billing_address?.address_1}
                    </span>
                    <span>
                        {data.customer.billing_address?.postal_code}
                        {data.customer.billing_address?.city}
                    </span>
                {/if}
            </div>
            <div>
                <h3>Shipping Address</h3>
                {#if !data.customer.shipping_addresses?.[0]?.address_1}
                    <span style="opacity: 0.5;">No address yet</span>
                {:else}
                    <span>
                        {data.customer.shipping_addresses?.[0]?.first_name}
                        {data.customer.shipping_addresses?.[0]?.last_name}
                    </span>
                    <span>
                        {data.customer.shipping_addresses?.[0]?.company}
                    </span>
                    <span>
                        {data.customer.shipping_addresses?.[0]?.address_1}
                        {data.customer.shipping_addresses?.[0]?.address_1}
                    </span>
                    <span>
                        {data.customer.shipping_addresses?.[0]?.postal_code}
                        {data.customer.shipping_addresses?.[0]?.city}
                    </span>
                {/if}
            </div>
        </div>
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
        display: flex;
        flex-direction: column;
        gap: 2em;
    }
}

.addresses-detail {
    div {
        margin-bottom: 1em;
    }
    h2 {
        margin-bottom: 0.5em;
        padding: 0.5em;
        width: 100%;
    }
    h3 {
        margin-bottom: 0.5em;
    }
}

.base-details {
    display: grid;
    gap: 0.5em;
    grid-template-columns: min-content auto;
    & > span:nth-of-type(even) {
        font-weight: bold;
    }
    & > .wide {
        font-size: 1.5em;
        grid-column: 1 / -1;
        padding-bottom: 0.5em;
    }
}
</style>
