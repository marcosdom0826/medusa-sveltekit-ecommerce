<script lang="ts">
import Drawer from '$components/Drawer.svelte';
import Nav from './Nav.svelte';
import MaterialSymbolsMenu from '~icons/material-symbols/menu';
let drawerOpen = false;
</script>

<header>
    <button class="menu-btn" on:click="{() => (drawerOpen = true)}"><MaterialSymbolsMenu /></button>
    <a class="logo" href="/">
        <h1>Brand</h1>
        <h1>Logo</h1>
    </a>
    <Nav desktop />
    <Drawer bind:open="{drawerOpen}">
        <Nav />
    </Drawer>
</header>

<style lang="postcss">
header {
    background-color: var(--cardColor);
    padding: 1rem;
    display: grid;
    place-items: center;
    grid-template-rows: min-content auto;
    @media (orientation: portrait) {
        grid-template-rows: auto;
        grid-template-columns: repeat(3, 1fr);
    }
}

.logo {
    display: grid;
    place-items: center;
}

.menu-btn {
    display: none;
    @media (orientation: portrait) {
        display: unset;
    }
    padding: 1rem;
    border: none;
    background-color: transparent;
    font-size: 1.5rem;
    cursor: pointer;
    margin: 0;
    box-shadow: none;
    justify-self: start;
}

a {
    text-decoration: none;
    color: var(--textColor);
}
</style>
