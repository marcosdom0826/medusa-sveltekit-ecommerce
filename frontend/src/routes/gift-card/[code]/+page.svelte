<script lang="ts">
import type { PageData } from './$types';

const { data }: { data: PageData } = $props();
</script>

<div class="content">
    <div>
        <h3>Thank you for your order!</h3>
        <h3>Your {data.balance / 100} € gift card code is</h3>
        <h2>{data.code}</h2>
    </div>
</div>

<style lang="postcss">
.content {
    display: grid;
    place-items: center;
    height: 100%;
    & > div {
        display: grid;
        justify-items: center;
        gap: 1em;
    }
}

span {
    font-weight: bold;
}
</style>
