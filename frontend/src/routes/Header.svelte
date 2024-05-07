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
import { page } from '$app/stores';
import CartItem from '$/lib/components/CartItem.svelte';
import { fade } from 'svelte/transition';

let navDrawerOpen = $state(false);

onMount(() => {
    const header = document.querySelector('header');
    const headerHeight = header?.offsetHeight;
    document.body.style.setProperty('--header-height', `${headerHeight || 0}px`);
});

const cartCount = $derived(
    // TODO: remove after eslint-plugin-svelte is updated
    // eslint-disable-next-line svelte/valid-compile
    $page.data.cart?.items?.reduce((acc: number, item: CartItem) => acc + item.quantity, 0) || 0
);
</script>

<header>
    <div class="lhs">
        <button class="menu-btn landscape-none" onclick="{() => (navDrawerOpen = true)}"
            ><MaterialSymbolsMenu /></button>
        <!-- TODO -->
    </div>
    <a class="logo" href="/">
        <Logo />
    </a>
    <div class="rhs">
        {#if !Object.values($page.route).find((val) => val?.includes('checkout'))}
            <button class="menu-btn" onclick="{() => ($cartDrawerOpen = true)}" transition:fade>
                <MdiCartOutline />
                {#if cartCount > 0}
                    <div class="badge" transition:fade><span>{cartCount}</span></div>
                {/if}
            </button>
        {/if}
        <ThemeToggle />
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

<Drawer bind:open="{$cartDrawerOpen}" side="right">
    <Cart />
</Drawer>

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
    position: relative;
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

.badge {
    position: absolute;
    font-size: 0.4em;
    background-color: red;
    color: white;
    border-radius: 100vw;
    padding: 0.4em 0.8em;
    font-weight: bold;
    top: 0;
    right: 0;
    translate: 25% -25%;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
}
</style>
