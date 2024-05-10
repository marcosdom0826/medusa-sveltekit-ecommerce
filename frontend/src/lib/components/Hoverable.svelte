<script lang="ts">
import type { Snippet } from 'svelte';

const { children, content }: { children?: Snippet; content?: Snippet } = $props();
</script>

<div>
    {@render children?.()}
    <div class="hover-content">
        <div>
            {@render content?.()}
        </div>
    </div>
</div>

<style lang="postcss">
div {
    position: relative;
    &:hover,
    &:focus-within {
        .hover-content {
            display: block;
            opacity: 1;
            animation: fade-in var(--transitionDuration) ease;
        }
    }
    .hover-content {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1;
        padding-top: 0.5em;
        opacity: 0;
        display: none;
        transition: all var(--transitionDuration) ease allow-discrete;
        & > div {
        }
    }
}

@keyframes fade-in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes fade-out {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
</style>
