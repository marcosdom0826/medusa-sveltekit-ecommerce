<script lang="ts">
export let page: number;
export let pageCount: number;
import MaterialSymbolsChevronRight from '~icons/material-symbols/chevron-right';
import MaterialSymbolsChevronLeft from '~icons/material-symbols/chevron-left';
</script>

{#if pageCount > 1}
    <div class="pagination">
        {#if page > 1}
            <a href="?page={page - 1}"><MaterialSymbolsChevronLeft /></a>
        {/if}

        {#if page > 3}
            <a href="?page=1">1</a>
            <span>...</span>
        {/if}

        {#if page > 2}
            <a href="?page={page - 2}">{page - 2}</a>
        {/if}

        {#if page > 1}
            <a href="?page={page - 1}">{page - 1}</a>
        {/if}
        <span style="font-weight: bold;">{page}</span>
        {#if page < pageCount}
            <a href="?page={page + 1}">{page + 1}</a>
        {/if}

        {#if page < pageCount - 1}
            <a href="?page={page + 2}">{page + 2}</a>
        {/if}

        {#if page < pageCount - 2}
            <span>...</span>
            <a href="?page={pageCount}">{pageCount}</a>
        {/if}

        {#if page < pageCount}
            <a href="?page={page + 1}"><MaterialSymbolsChevronRight /></a>
        {/if}
    </div>
{/if}

<style lang="postcss">
a {
    color: var(--textColor);
    text-decoration: none;
    display: grid;
    place-items: center;
}

.pagination {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    align-items: center;
    padding: 1em;
    font-size: 1.5em;
}
</style>
