<script lang="ts">
import type { CartItem } from '../medusa';

export let item: CartItem;
console.log(item);
</script>

<form class="cart-item">
    <picture>
        <source srcset="{item.thumbnail}" />
        <img src="{item.thumbnail}" alt="{item.title}" />
    </picture>
    <h3>{item.title}</h3>
    <span class="total-price">{(item.subtotal || item.unit_price) / 100}€</span>
    <span class="variant">{item.variant.title}</span>
    <span class="price">{item.unit_price / 100}€</span>
    <input type="number" value="{item.quantity}" />
</form>

<style lang="postcss">
.cart-item {
    width: 100%;
    display: grid;
    gap: 1em;
    grid-template-columns: minmax(5em, 6em) auto min-content;
    grid-template-rows: min-content min-content min-content min-content;
    position: relative;
    align-items: center;

    & > * {
        grid-column: 2 / -1;
    }
    & h3 {
        grid-column: 2 / span 1;
    }
    & .total-price {
        grid-column: 3 / span 1;
    }
    & picture,
    & img {
        grid-column: 1 / 2;
        grid-row: 1 / span all;
        place-items: center;
        object-fit: cover;
        place-self: center;
        height: 100%;
    }
}

.price {
    font-weight: bold;
}

.variant {
    font-weight: bold;
}

.total-price {
    font-weight: bold;
    font-size: 1.1em;
}
</style>
