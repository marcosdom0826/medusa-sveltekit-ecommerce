<script lang="ts">
import type { PageData } from './$types';

export let data: PageData;
</script>

<div class="wrapper">
    <div>
        <h3>Thank you for your order!</h3>
        <h3>Your {data.balance / 100} € gift card code is</h3>
        <h2>{data.code}</h2>
    </div>
</div>

<style lang="postcss">
.wrapper {
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
