<script lang="ts">
import Header from './Header.svelte';
import Footer from './Footer.svelte';
import '../main.pcss';
</script>

<svelte:head></svelte:head>

<div class="wrapper">
    <Header />

    <main>
        <slot />
    </main>

    <Footer />
</div>

<style lang="postcss">
:global(body) {
    position: absolute;
    inset: 0;
}

.wrapper {
    display: grid;
    grid-template-rows: min-content auto min-content;
    width: 100%;
    height: 100%;
}

main {
    padding: 1rem;
}
</style>
