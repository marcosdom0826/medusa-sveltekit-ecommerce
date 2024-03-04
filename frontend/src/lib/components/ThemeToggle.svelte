<script lang="ts">
import { onMount } from 'svelte';
import PhMoon from '~icons/ph/moon';
import PhSun from '~icons/ph/sun';

let darkMode = false;
const toggleTheme = () => {
    const body = document.querySelector('body');
    const html = document.querySelector('html');
    if (darkMode) {
        body?.classList.remove('theme-dark');
        body?.classList.add('theme-light');
        setTimeout(() => {
            html?.setAttribute('data-theme', 'light');
        }, 300);
        window.localStorage.setItem('theme', 'light');
    } else {
        body?.classList.remove('theme-light');
        body?.classList.add('theme-dark');
        window.localStorage.setItem('theme', 'dark');
        setTimeout(() => {
            html?.setAttribute('data-theme', 'dark');
        }, 300);
    }
    darkMode = !darkMode;
};

onMount(() => {
    const theme = window.localStorage.getItem('theme');
    const body = document.querySelector('body');
    const html = document.querySelector('html');
    if (theme) {
        body?.classList.remove(theme === 'dark' ? 'theme-light' : 'theme-dark');
        body?.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
        darkMode = theme === 'dark';
        setTimeout(() => {
            html?.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
        }, 300);
    }
    const hasTheme = body?.classList.contains('theme-dark') || body?.classList.contains('theme-light');
    const isDark =
        (hasTheme
            ? body?.classList.contains('theme-dark')
            : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) || false;
    darkMode = isDark;
});
</script>

<div class="wrapper">
    <input type="checkbox" class="toggle" checked="{darkMode}" on:change="{() => toggleTheme()}" />
    <div class="icon {darkMode ? 'checked' : ''}">
        {#if darkMode}
            <PhMoon />
        {:else}
            <PhSun />
        {/if}
    </div>
</div>

<style lang="postcss">
.wrapper {
    position: relative;
}

.icon {
    --toggle-height: 2em;
    --toggle-width: 3.5em;
    --indicator-padding: 0.7em;
    width: auto;
    height: var(--toggle-height);
    position: absolute;
    top: 0;
    bottom: 0;
    display: grid;
    align-items: center;
    pointer-events: none;
    left: calc(var(--indicator-padding) / 2 + 0.75px);
    transition-property: left;
    transition-duration: var(--transitionDuration);
    &.checked {
        left: calc(var(--toggle-width) - var(--toggle-height) + (var(--indicator-padding) / 2 + 0.75px));
    }
    & :global(svg) {
        padding: 0.1em;
    }
}

input[type='checkbox']:is(.toggle) {
    transition-property: all;
    position: relative;

    &::before {
        background-color: rgba(128, 128, 128, 0.25);
        border: 1px solid tran;
    }
    &::after {
        content: '';
        transition-property: left;
        transition-duration: var(--transitionDuration);
        background-color: var(--inverseTextColor);
    }
    &:checked {
        &::after {
            content: '';
            left: calc(var(--toggle-width) - var(--toggle-height) + (var(--indicator-padding) / 2));
        }
    }
}
</style>
