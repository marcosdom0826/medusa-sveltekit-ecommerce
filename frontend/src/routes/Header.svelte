<script lang="ts">
import Drawer from '$components/Drawer.svelte';
import Nav from './Nav.svelte';
import MaterialSymbolsMenu from '~icons/material-symbols/menu';
import MdiCartOutline from '~icons/mdi/cart-outline';
import MdiAccountOutline from '~icons/mdi/account-outline';
import Logo from '$assets/logo.svg?component';
import BreadCrumbs from '$/lib/components/BreadCrumbs.svelte';
import { onMount } from 'svelte';
import ThemeToggle from '$/lib/components/ThemeToggle.svelte';
import Cart from '$/lib/components/Cart.svelte';
import { cartDrawerOpen } from '$/lib/stores/cartDrawer';
import { page } from '$app/stores';
import CartItem from '$/lib/components/CartItem.svelte';
import { fade } from 'svelte/transition';
import Hoverable from '$/lib/components/Hoverable.svelte';

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

$inspect($page.data);
</script>

<header>
    <div class="lhs">
        <button class="menu-btn landscape-none" onclick="{() => (navDrawerOpen = true)}"
            ><MaterialSymbolsMenu /></button>
        <a class="menu-btn landscape-none" href="/account">
            <MdiAccountOutline />
        </a>
    </div>
    <a class="logo" href="/">
        <Logo style="width: 100%; max-height: 40px;" />
    </a>
    <div class="rhs">
        <Hoverable>
            <a class="menu-btn portrait-none" href="/account">
                <span>
                    {#if $page.data?.customer}
                        {$page.data.customer.first_name}
                    {:else}
                        My Account
                    {/if}
                </span><MdiAccountOutline />
            </a>
            {#snippet content()}
                <div class="account-hover">
                    {#if $page.data?.customer}
                        <span style="font-size: 1.3em;">My Account</span>
                        <div class="acc-links">
                            <a href="/account/">My Summary</a>
                            <a href="/account/orders">My Orders</a>
                        </div>
                        <span>Not {$page.data.customer.first_name}?</span>
                        <a href="/account/logout" data-sveltekit-reload>Logout</a>
                    {:else}
                        <a href="/account/login" class="button primary">Login</a>
                        <span>No account yet?</span>
                        <a href="/account/register">Register now</a>
                    {/if}
                </div>
            {/snippet}
        </Hoverable>
        {#if !Object.values($page.route).find((val) => val?.includes('checkout'))}
            <button class="menu-btn" onclick="{() => ($cartDrawerOpen = true)}" transition:fade>
                <span class="portrait-none">Basket</span>
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
    {#if $page.data?.customer}
        <div class="mobile-sub-links">
            <a href="/account/">My Account</a>
            <a href="/account/orders">My Orders</a>
            <a href="/account/logout" data-sveltekit-reload>Logout</a>
        </div>
    {/if}
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
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: min-content auto;
    @media (orientation: portrait) {
        grid-template-rows: auto;
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
    @media (orientation: landscape) {
        display: none !important;
    }
}

.portrait-none {
    @media (orientation: portrait) {
        display: none !important;
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
    place-items: center;
    display: flex;
    gap: 0.25em;
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
    gap: 2rem;
    @media (orientation: portrait) {
        gap: 1em;
    }
}
.lhs {
    display: flex;
    flex-direction: row;
    justify-self: left;
    gap: 2rem;
    @media (orientation: portrait) {
        gap: 1em;
    }
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

.account-hover {
    border-radius: 0.5em;
    background-color: var(--cardColor);
    padding: 2em;
    filter: drop-shadow(2px 2px 4px var(--shadowColor));
    z-index: 10;
    display: grid;
    gap: 0.5em;
    white-space: nowrap;
    place-items: center;

    & .acc-links {
        display: flex;
        flex-direction: column;
        padding: 1em 0;
        width: 100%;
        gap: 0.5em;
        position: relative;
        & > a {
            text-decoration: none;
            font-weight: normal;
        }
        ::before {
            content: '';
            width: 100%;
            height: 1px;
            background-color: var(--textColor);
            position: absolute;
            top: 0.5em;
            left: 0;
            opacity: 0.5;
        }
        ::after {
            content: '';
            width: 100%;
            height: 1px;
            background-color: var(--textColor);
            position: absolute;
            bottom: 0.5em;
            left: 0;
            opacity: 0.5;
        }
    }

    & a.primary {
        color: var(--inverseTextColor);
        text-decoration: none;
        width: 100%;
        margin-bottom: 1em;
    }
    & a {
        color: var(--textColor);
        font-weight: bold;
        text-decoration: underline;
        &:hover {
            opacity: 0.5;
        }
        transition: opacity var(--transitionDuration) ease;
    }
    &::before {
        content: '';
        width: 1.5em;
        height: 1.5em;
        background: var(--cardColor);
        position: absolute;
        top: 0;
        left: 50%;
        translate: -50% -50%;
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    }
}

.mobile-sub-links {
    padding: 2em;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 1em;
}
</style>
