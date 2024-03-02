<script lang="ts">
import Drawer from '$components/Drawer.svelte';
import Nav from './Nav.svelte';
import MaterialSymbolsMenu from '~icons/material-symbols/menu';
import MdiCartOutline from '~icons/mdi/cart-outline';
import Logo from '$assets/logo.svg?component';
import BreadCrumbs from '$/lib/components/BreadCrumbs.svelte';
import { onMount } from 'svelte';
import ThemeToggle from '$/lib/components/ThemeToggle.svelte';
import Cart from '$/lib/components/Cart.svelte';
import { cartDrawerOpen } from '$/lib/stores/cartDrawer';

let navDrawerOpen = false;

onMount(() => {
    const header = document.querySelector('header');
    const headerHeight = header?.offsetHeight;
    document.body.style.setProperty('--header-height', `${headerHeight || 0}px`);
});
</script>

<header>
    <div class="lhs">
        <button class="menu-btn landscape-none" on:click="{() => (navDrawerOpen = true)}"
            ><MaterialSymbolsMenu /></button>
        <!-- TODO -->
    </div>
    <a class="logo" href="/">
        <Logo />
    </a>
    <div class="rhs">
        <button class="menu-btn" on:click="{() => ($cartDrawerOpen = true)}"><MdiCartOutline /></button
        ><ThemeToggle />
    </div>
    <div class="nav-container">
        <Nav desktop />
    </div>
    <div class="breadcrumb-container">
        <BreadCrumbs />
    </div>
</header>

<Drawer bind:open="{navDrawerOpen}">
    <Nav desktop="{false}" />
</Drawer>

<Drawer bind:open="{$cartDrawerOpen}" side="right"><Cart /></Drawer>

<style lang="postcss">
header {
    background-color: var(--cardColor);
    padding: 1rem;
    display: grid;
    place-items: center;
    grid-template-columns: repeat(3, 1fr);
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
    place-self: center;
}

.landscape-none {
    display: none;
    @media (orientation: portrait) {
        display: unset;
    }
}

.menu-btn {
    padding: 1rem;
    border: none;
    background-color: transparent;
    font-size: 1.5rem;
    padding: 0;
    cursor: pointer;
    margin: 0;
    box-shadow: none;
    justify-self: start;
    &:hover,
    &:focus-visible {
        opacity: 0.75;
    }
}

a {
    text-decoration: none;
    color: var(--textColor);
}

.nav-container {
    grid-column: 1 / -1;
}
.breadcrumb-container {
    grid-column: 1 / -1;
    width: 100%;
}

.rhs {
    justify-self: right;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
}
.lhs {
    justify-self: left;
}
</style>
