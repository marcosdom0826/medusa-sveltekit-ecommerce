<script lang="ts">
import ProductGallery from '$/lib/components/ProductGallery.svelte';
import type { PageData } from './$types';

const { data }: { data: PageData } = $props();
</script>

<div class="content">
    <ProductGallery products="{data.products}" />
</div>

<style lang="postcss">
.content {
    padding: 1rem;
}
</style>
