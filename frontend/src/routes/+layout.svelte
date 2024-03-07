<script lang="ts">
import Header from './Header.svelte';
import Footer from './Footer.svelte';
import '../main.pcss';
import { onNavigate } from '$app/navigation';
import { page } from '$app/stores';

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

$: email = $page.url.searchParams.get('email') === 'true';
</script>

<svelte:head></svelte:head>

{#if !email}
    <Header />
{/if}

<main style="view-transition-name: main;">
    <slot />
</main>

{#if !email}
    <Footer />
{/if}

<style lang="postcss">
:global(body) {
    position: absolute;
    inset: 0;
    --header-height: 100px;
}

main {
    min-height: calc(100% - var(--header-height, 0px) - var(--footer-height, 0px));
    position: relative;
    display: grid;

    & > :global(*) {
        grid-row: 1;
        grid-column: 1;
    }
}

:global(footer) {
}
</style>
