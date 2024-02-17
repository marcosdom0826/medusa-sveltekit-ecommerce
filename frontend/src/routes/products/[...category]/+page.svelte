<script lang="ts">
import ProductGallery from '$/lib/components/ProductGallery.svelte';
import type { PageData } from './$types';

export let data: PageData;
</script>

<ProductGallery products="{data.products}" />

<style lang="postcss">
</style>
