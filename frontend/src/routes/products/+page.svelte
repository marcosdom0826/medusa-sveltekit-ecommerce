<script lang="ts">
import Paginator from '$/lib/components/Paginator.svelte';
import ProductGallery from '$/lib/components/ProductGallery.svelte';
import type { PageData } from './$types';

const { data }: { data: PageData } = $props();
</script>

<div class="content">
    <ProductGallery products="{data.products}" />
    <Paginator page="{data.page}" pageCount="{data.pageCount}" />
</div>

<style lang="postcss">
.content {
    padding: 1rem;
}
</style>
