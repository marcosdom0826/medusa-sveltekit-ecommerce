<script lang="ts">
import { t } from '$/lib/i18n';
import type { ProductCategory } from '$/lib/medusa';
import { page } from '$app/stores';

export let desktop = true;

const categories: Record<string, ProductCategory> = $page.data.categoriesByHandle || {};
</script>

<nav class="{desktop ? 'desktop-nav' : 'mobile-nav'}">
    <ul>
        {#each Object.entries(categories) as [handle, category]}
            {#if category.metadata.nav}
                <li>
                    <a href="/products/{handle}{handle === 'giftcards' ? '/view/gift-card' : ''}"
                        >{$t(`${category.name}`)}</a>
                </li>
            {/if}
        {/each}
        <li>
            <a href="/about">About</a>
        </li>
    </ul>
</nav>

<style lang="postcss">
a {
    white-space: nowrap;
    text-decoration: none;
    padding: 1em;
    color: var(--textColor);

    position: relative;
}

nav li {
    position: relative;
    display: block;
}

nav li {
    &::after {
        content: '';
        height: 3px;
        width: 100%;
        bottom: 0em;
        transform: translateY(0.25em);
        left: 0;
        position: absolute;
        background: var(--textColor);
        scale: 0 1;
        transition:
            scale 200ms var(--scaleDelay, 0ms) ease,
            translate 400ms var(--translateDelay, 0ms) ease;
    }
    &:hover,
    &:focus-within {
        &::after {
            scale: 1 1;
        }
    }
}

@supports selector(:has(h1)) {
    nav li {
        &:hover {
            & + li::after {
                translate: -100%;
                --scaleDelay: 200ms;
                --translateDelay: 200ms;
            }
        }
        &:has(+ :hover) {
            &::after {
                translate: 100%;
                --scaleDelay: 200ms;
                --translateDelay: 200ms;
            }
        }
    }
}

.desktop-nav {
    @media (orientation: portrait) {
        display: none;
    }
}

.mobile-nav > ul {
    display: flex;
    flex-direction: column;
    list-style: none;
    gap: 1em;
    padding: 0;
    font-weight: bold;
    width: fit-content;
    & > li > ul {
        display: grid;
        position: relative;
        grid-template-columns: 1fr;
    }
    & a {
    }
    & li {
        overflow: hidden;
        width: fit-content;
    }
}

nav {
    padding: 1rem;
}
nav > ul {
    display: flex;
    list-style: none;
    padding: 0;
    font-weight: bold;
}
</style>
