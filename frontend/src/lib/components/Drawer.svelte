<script lang="ts">
import { onMount } from 'svelte';
import MaterialSymbolsClose from '~icons/material-symbols/close';

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
</script>

<div class="drawer {side === 'left' ? 'left' : 'right'} {open && 'open'}">
    <slot name="header">
        <div class="drawer-header">
            <button on:click="{close}"><MaterialSymbolsClose /></button>
        </div>
    </slot>
    <slot />
</div>
<button class="scrim {open && 'open'}" on:click="{() => cancellable && close()}"></button>

<style lang="postcss">
.drawer {
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: var(--cardColor);
    z-index: 11;
    transition: transform 0.2s ease-in-out;
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
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
    display: none;
    margin: 0;
    border: none;
    outline: none;
    border-radius: 0;
}

.open {
    transform: translateX(0);
    display: block;
}

.drawer-header {
    display: flex;
    justify-content: flex-end;
    & button {
        padding: 1rem;
        border: none;
        background-color: transparent;
        font-size: 1.5rem;
        cursor: pointer;
        margin: 0;
        box-shadow: none;
    }
}
</style>
