<script lang="ts">
import { t } from '$/lib/i18n';
import type { ProductCategory } from '$/lib/medusa';
import { page } from '$app/stores';

export let desktop = false;

const categories: Record<string, ProductCategory> = $page.data.headerCategories || [];
</script>

<nav class="{desktop ? 'desktop-nav' : 'mobile-nav'}">
    <ul>
        {#each Object.entries(categories) as [handle, category]}
            <li><a href="/products/{handle}">{$t(`${category.name}`)}</a></li>
        {/each}
        <li>
            <a href="/about">About</a>
            <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Kontakt</a></li>
            </ul>
        </li>
    </ul>
</nav>

<style lang="postcss">
a {
    white-space: nowrap;
    padding: 0.5em;
    color: var(--textColor);
    &:hover {
        opacity: 0.5;
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
    gap: 1rem;
    list-style: none;
    padding: 0;
    font-weight: bold;
    & > li > ul {
        display: grid;
        position: relative;
    }
}

nav {
    padding: 1rem;
}
nav > ul {
    display: flex;
    gap: 1rem;
    list-style: none;
    padding: 0;
    font-weight: bold;
}

nav > ul > li {
    position: relative;
}

li > ul {
    display: none;
    position: absolute;
    background-color: var(--cardColor);
    padding: 1rem;
    gap: 1rem;
    top: 100%;
    left: 0;
    z-index: 1;
    list-style: none;
}

li:has(:hover, :focus-visible) {
    & > ul {
        display: grid;
    }
}
</style>
