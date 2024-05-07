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

const { children } = $props();

// TODO: remove after eslint-plugin-svelte is updated
// eslint-disable-next-line svelte/valid-compile
const email = $derived($page.url.searchParams.get('email') === 'true');
</script>

<svelte:head></svelte:head>

{#if !email}
    <Header />
{/if}

<main style="view-transition-name: main;">
    {@render children()}
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
