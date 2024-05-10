<script lang="ts">
import { onNavigate } from '$app/navigation';
import { onMount, type Snippet } from 'svelte';
import Logo from '$assets/logo.svg?component';
import MaterialSymbolsArrowBackRounded from '~icons/material-symbols/arrow-back-rounded';
import { browser } from '$app/environment';

let {
    open = $bindable(false),
    // eslint-disable-next-line prefer-const
    side = 'left',
    // eslint-disable-next-line prefer-const
    cancellable = true,
    // eslint-disable-next-line prefer-const
    header,
    // eslint-disable-next-line prefer-const
    children
}: {
    open?: boolean;
    side?: 'left' | 'right';
    cancellable?: boolean;
    header?: Snippet;
    children?: Snippet;
} = $props();

const close = () => {
    open = false;
};

onMount(() => {
    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && cancellable) {
            close();
        }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => {
        window.removeEventListener('keydown', handleKeydown);
    };
});

onNavigate(() => {
    close();
});

const scrollbarWidth = $derived(browser ? window.innerWidth - document.documentElement.clientWidth : 0);

$effect(() => {
    if (browser) {
        if (open) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.style.transition = 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            setTimeout(() => (document.body.style.transition = ''), 250);
        }
    }
});
</script>

<div class="drawer {side === 'left' || side === undefined ? 'left' : 'right'} {open && 'open'}">
    {#if header}
        {@render header()}
    {:else}
        <div class="drawer-header">
            {#if side === 'left'}
                <button onclick="{close}"><MaterialSymbolsArrowBackRounded /></button>
            {/if}
            <div>
                <Logo style="width: 10rem;" />
            </div>
            {#if side === 'right'}
                <button onclick="{close}" style="transform: rotate(180deg);"
                    ><MaterialSymbolsArrowBackRounded /></button>
            {/if}
        </div>
    {/if}
    {#if children}
        {@render children()}
    {/if}
</div>
<button class="scrim {open && 'open'}" onclick="{() => cancellable && close()}"></button>

<style lang="postcss">
.drawer {
    position: fixed;
    top: 0;
    bottom: 0;
    background-color: var(--cardColor);
    z-index: 100;
    transition: transform 0.2s ease-in-out;
    display: grid;
    grid-template-rows: min-content auto;
    height: 100%;
    width: fit-content;
    &.left {
        border-radius: 0 1rem 1rem 0;
    }
    &.right {
        border-radius: 1rem 0 0 1rem;
    }
    &.open {
        transform: translateX(0);
    }
}
.left {
    left: 0;
    transform: translateX(-100%);
}
.right {
    right: 0;
    transform: translateX(100%);
}

.scrim {
    position: fixed;
    width: 100%;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    margin: 0;
    border: none;
    outline: none;
    border-radius: 0;
    opacity: 0;
    z-index: -1;
    transition: opacity var(--transitionDuration) ease;
    &.open {
        z-index: 90;
        opacity: 1;
    }
}

.drawer-header {
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    padding: 1rem;
    & button {
        padding: 0;
        border: none;
        background-color: transparent;
        font-size: 1.5rem;
        cursor: pointer;
        margin: 0;
        box-shadow: none;
    }
    & div {
        padding: 1rem;
    }
}
</style>
