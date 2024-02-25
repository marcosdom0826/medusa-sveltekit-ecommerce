<script lang="ts">
import Logo from '$assets/logo.svg?component';
import { onMount } from 'svelte';

onMount(() => {
    const footer = document.querySelector('footer');
    const footerHeight = footer?.offsetHeight;
    document.body.style.setProperty('--footer-height', `${footerHeight || 0}px`);
});
</script>

<footer>
    <div class="logo">
        <Logo />
    </div>

    <div class="footer-nav-content">
        <ul>
            <li><a href="/agb">AGB</a></li>
            <li><a href="/imprint">Impressum</a></li>
            <li><a href="/data-protection">Datenschmutz</a></li>
            <li><a href="/recall">Wiederrufsinformationen</a></li>
        </ul>

        <ul>
            <li><a href="/shipping">Versand und Lieferung</a></li>
            <li><a href="/payment">Bezahlungsarten</a></li>
            <li><a href="/contact">Kontakt</a></li>
        </ul>
    </div>
</footer>

<style lang="postcss">
footer {
    --cellSize: 220px;
    background-color: var(--cardColor);
    @media (orientation: portrait) {
        padding: 1rem 0 0 0;
    }
    @media (orientation: landscape) {
        padding: 2rem 0;
    }
    display: grid;
    place-items: center;
    place-content: center;
    grid-template-columns: repeat(auto-fit, minmax(var(--cellSize), auto));
    grid-auto-rows: auto;
    max-width: 100%;
}

.footer-nav-content {
    padding: 1em;
    display: flex;
    gap: 1rem;
    flex-direction: row;
    flex-wrap: wrap;
}

.logo {
    display: grid;
    place-items: center;
}

a {
    white-space: nowrap;
    padding: 0.5em;
    color: var(--textColor);
    &:hover {
        opacity: 0.5;
    }
}

ul {
    display: grid;
    gap: 1rem;
    list-style: none;
    padding: 0;
    grid-auto-flow: row;
    place-content: center;
}
</style>
