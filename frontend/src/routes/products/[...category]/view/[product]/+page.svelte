<script lang="ts">
import { onMount } from 'svelte';
import type { PageData } from './$types';

export let data: PageData;

let zoomed = false;
let imgTranslate = '0 0';
let pictureEl: HTMLPictureElement | undefined;
let hasZoomTransitions = false;

const zoomFactor = 2.25;

const zoomMouseHandler = (e: MouseEvent) => {
    if (!e.target || !(e.target instanceof HTMLElement)) {
        return;
    }
    const x = (e.offsetX / e.target.clientWidth) * 100;
    const y = (e.offsetY / e.target.clientHeight) * 100;
    imgTranslate = `${-(x - 50) * (zoomFactor - 1)}% ${-(y - 50) * (zoomFactor - 1)}%`;
};
const setZoomed = (e: Event, value: boolean) => {
    zoomed = value;
    if (!zoomed) {
        pictureEl?.removeEventListener('mousemove', zoomMouseHandler);
        hasZoomTransitions = false;
        imgTranslate = '0 0';
    }
    if (zoomed) {
        zoomMouseHandler(e as PointerEvent);
        setTimeout(() => {
            hasZoomTransitions = true;
            pictureEl?.addEventListener('mousemove', zoomMouseHandler);
        }, 250);
    }
};
</script>

<div class="wrapper">
    <div class="product-content">
        <div class="image-view">
            <button on:click="{(e) => setZoomed(e, !zoomed)}" on:mouseleave="{(e) => setZoomed(e, false)}">
                <picture
                    class="{zoomed ? 'zoomed' : ''} {hasZoomTransitions ? 'zoom-transitions' : ''}"
                    style="--translate: {imgTranslate}; --scale: {zoomFactor};"
                    bind:this="{pictureEl}">
                    <source srcset="{data.product.images?.[0]?.url}" />
                    <img src="{data.product.images?.[0]?.url}" alt="{data.product.title}" loading="lazy" />
                </picture>
            </button>
        </div>
        <div class="product-info">
            <h2>{data.product.title}</h2>
            <h3>{data.product.subtitle}</h3>
            <p>{data.product.description}</p>
        </div>
    </div>
</div>

<style lang="postcss">
.wrapper {
    display: grid;
    place-items: center;
}

.product-content {
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: min(100%, 1600px);
    grid-template-rows: minmax(75dvh, 25dvh);
}

.product-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
}

.image-view button {
    padding: 0;
    border: none;
    cursor: zoom-in;
    overflow: hidden;
}

.zoomed {
    object-fit: none;
    scale: var(--scale);
    translate: var(--translate);
}

.zoom-transitions {
    transition: scale var(--transitionDuration) ease;
}

picture,
img {
    object-fit: contain;
    transition:
        scale var(--transitionDuration) ease,
        translate var(--transitionDuration) ease;
}
</style>
