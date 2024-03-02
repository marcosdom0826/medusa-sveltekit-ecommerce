<script lang="ts">
import type { PricedProduct } from '../medusa';

export let product: PricedProduct;
export let quantity: number;

console.log(product);
console.log(quantity);
</script>

<div>
    <h1>{product.title}</h1>
    <!-- <p>{product.variant.title}</p>
    <p>{product.variant.price}</p> -->
    <p>{quantity}</p>
</div>
