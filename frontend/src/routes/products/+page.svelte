<script lang="ts">
import Paginator from '$/lib/components/Paginator.svelte';
import ProductGallery from '$/lib/components/ProductGallery.svelte';
import type { PageData } from './$types';

export let data: PageData;
</script>

<div>
    <ProductGallery products="{data.products}" />
    <Paginator page="{data.page}" pageCount="{data.pageCount}" />
</div>

<style lang="postcss">
</style>
