<script lang="ts">
import Header from './Header.svelte';
import Footer from './Footer.svelte';
import '../main.pcss';
import { onNavigate } from '$app/navigation';

onNavigate((navigation) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(document as any).startViewTransition) return;

    return new Promise((resolve) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).startViewTransition(async () => {
            resolve();
            await navigation.complete;
        });
    });
});
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
    overflow: auto;
}

main {
    padding: 1rem;
}
</style>
