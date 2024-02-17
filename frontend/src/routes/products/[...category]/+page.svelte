<script lang="ts">
import ProductGallery from '$/lib/components/ProductGallery.svelte';
import type { PageData } from './$types';

export let data: PageData;
</script>

<div class="content">
    <ProductGallery products="{data.products}" />
</div>

<style lang="postcss">
.content {
    padding: 1rem;
}
</style>
