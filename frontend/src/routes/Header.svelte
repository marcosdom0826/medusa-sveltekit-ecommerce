<script lang="ts">
import Drawer from '$components/Drawer.svelte';
import Nav from './Nav.svelte';
import MaterialSymbolsMenu from '~icons/material-symbols/menu';
import Logo from '$assets/logo.svg?component';
import BreadCrumbs from '$/lib/components/BreadCrumbs.svelte';

let drawerOpen = false;
</script>

<header>
    <button class="menu-btn" on:click="{() => (drawerOpen = true)}"><MaterialSymbolsMenu /></button>
    <a class="logo" href="/">
        <Logo />
    </a>
    <div><!-- TODO --></div>
    <Nav desktop />
    <div class="breadcrumb-container">
        <BreadCrumbs />
    </div>
</header>
<Drawer bind:open="{drawerOpen}">
    <Nav desktop="{false}" />
</Drawer>

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
        position: sticky;
        top: 0;
        z-index: 10;
    }
}

.logo {
    display: grid;
    place-items: center;
    padding: 1rem;
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
    padding: 0;
    cursor: pointer;
    margin: 0;
    box-shadow: none;
    justify-self: start;
}

a {
    text-decoration: none;
    color: var(--textColor);
}

.breadcrumb-container {
    grid-column: 1 / -1;
    width: 100%;
}
</style>
