<script lang="ts">
import { page } from '$app/stores';
import { t } from '$/lib/i18n';

// TODO: fix after eslint-plugin-svelte is updated
// eslint-disable-next-line svelte/valid-compile
const crumbs = $derived($page.data.crumbs || []);
</script>

<nav>
    <ul>
        {#each crumbs as crumb, idx}
            {#key crumb.href}
                <li>
                    <a href="{crumb.href}">{$t(`${crumb.name}`)}</a>
                </li>
                {#if idx !== crumbs.length - 1}
                    <span>›</span>
                {/if}
            {/key}
        {/each}
    </ul>
</nav>

<style lang="postcss">
nav {
    padding: 0.25rem;
    font-size: 0.8em;
    width: 100%;
    overflow: hidden;
}

ul {
    list-style: none;
    white-space: nowrap;
    padding: 0;
    display: flex;
    gap: 0.25rem;
    overflow: hidden;
    & > :last-child {
        & > a {
            font-weight: bold;
        }
    }
    &:not(:first-child, :last-child) {
        overflow: hidden;
    }
}

li {
    display: flex;
    overflow: hidden;
}

a {
    color: var(--textColor);
    text-decoration: none;
    transition: color 0.2s;
    opacity: 0.7;
    &:hover {
        opacity: 1;
    }
    transition-property: opacity;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>
