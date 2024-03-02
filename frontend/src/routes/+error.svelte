<script lang="ts">
import { page } from '$app/stores';
</script>

<div class="wrapper">
    <div>
        <h1>{$page?.status}</h1>
        <h2>{$page.error?.message}</h2>
    </div>
</div>

<style lang="postcss">
.wrapper {
    position: absolute;
    inset: 0;
    padding: 1em;
    @media (orientation: portrait) {
        position: static;
    }
}
div {
    display: grid;
    place-items: center;
}
</style>
