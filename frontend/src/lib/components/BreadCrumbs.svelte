<script lang="ts">
import { page } from '$app/stores';

$: crumbs = $page.data.crumbs || [];
</script>

<nav>
    <ul>
        {#each crumbs as crumb}
            {#key crumb.href}
                <li>
                    <a href="{crumb.href}">{crumb.name}</a>
                </li>
            {/key}
        {/each}
    </ul>
</nav>

<style lang="postcss">
nav {
    padding: 0.25rem;
    font-size: 0.8em;
    width: 100%;
}

ul {
    list-style: none;
    padding: 0;
    display: flex;
    gap: 1rem;
}

li {
    display: flex;
}
</style>
