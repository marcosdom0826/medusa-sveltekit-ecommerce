<script lang="ts">
import { onNavigate } from '$app/navigation';
import { onMount } from 'svelte';
import Logo from '$assets/logo.svg?component';
import MaterialSymbolsArrowBackRounded from '~icons/material-symbols/arrow-back-rounded';

export let open = false;
export let side: 'left' | 'right' = 'left';
export let cancellable = true;
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
</script>

<div class="drawer {side === 'left' ? 'left' : 'right'} {open && 'open'}">
    <slot name="header">
        <div class="drawer-header">
            <button on:click="{close}"><MaterialSymbolsArrowBackRounded /></button>
            <div>
                <Logo />
            </div>
        </div>
    </slot>
    <slot />
</div>
<button class="scrim {open && 'open'}" on:click="{() => cancellable && close()}"></button>

<style lang="postcss">
.drawer {
    position: fixed;
    top: 0;
    bottom: 0;
    background-color: var(--cardColor);
    z-index: 100;
    transition: transform 0.2s ease-in-out;
    border-radius: 0 1rem 1rem 0;
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

.open {
    display: block;
}

.drawer-header {
    display: flex;
    justify-content: flex-start;
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
