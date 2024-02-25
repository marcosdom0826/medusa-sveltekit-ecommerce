<script lang="ts">
import type { PricedProduct } from '$lib/medusa';
import { onMount } from 'svelte';
import MdiChevronLeft from '~icons/mdi/chevron-left';
import MdiChevronRight from '~icons/mdi/chevron-right';

export let product: PricedProduct;
export let zoomFactor = 2.25;

let zoomed = false;
let imgTranslate = '0 0';

let lastScrollLeft = 0;
let isDragging = false;

let hasZoomTransitions = false;
let lastTouchX = 0;
let lastTouchStartX = 0;

let currentImage = 0;

let mainImageWrapper: HTMLDivElement | undefined;
let slideWrapper: HTMLDivElement | undefined;
let thumbnails: HTMLDivElement | undefined;

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
        slideWrapper?.removeEventListener('mousemove', zoomMouseHandler);
        hasZoomTransitions = false;
        imgTranslate = '0 0';
    }
    if (zoomed) {
        zoomMouseHandler(e as PointerEvent);
        setTimeout(() => {
            hasZoomTransitions = true;
            slideWrapper?.addEventListener('mousemove', zoomMouseHandler);
        }, 250);
    }
};

const scrollToThumbnail = (index: number) => {
    const thumbnail = thumbnails?.children[index];
    if (thumbnail instanceof HTMLElement) {
        thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
};

const dragEndHandler = (e: Event) => {
    if (!isDragging) {
        return;
    }
    const movementX = Math.abs(lastTouchStartX - lastTouchX);
    if (e instanceof TouchEvent && movementX < 10) {
        isDragging = false;
        return;
    }
    setTimeout(() => {
        isDragging = false;
    }, 0);
    const scrollLeft = slideWrapper?.scrollLeft;
    const scrollWidth = slideWrapper?.scrollWidth;
    const clientWidth = slideWrapper?.clientWidth;
    if (scrollLeft && scrollWidth && clientWidth) {
        const percentageScrolled = scrollLeft / (scrollWidth - clientWidth);
        const index = Math.floor(percentageScrolled * (product.images?.length || 0));
        const remainder = percentageScrolled * (product.images?.length || 0) - index;
        let finalIndex;
        if (scrollLeft > lastScrollLeft) {
            finalIndex = remainder >= 0.25 ? index + 1 : index;
        } else {
            finalIndex = remainder > 0.75 ? index : index - 1;
        }
        slideWrapper?.scrollTo({
            top: 0,
            left: finalIndex * clientWidth,
            behavior: 'smooth'
        });
        currentImage = finalIndex;
        scrollToThumbnail(finalIndex);
    }
};

const scrollToImage = (index: number) => {
    const clientWidth = slideWrapper?.clientWidth;
    if (clientWidth) {
        const scrollPosition = index * clientWidth;
        slideWrapper?.scrollTo({
            top: 0,
            left: scrollPosition,
            behavior: 'smooth'
        });
        currentImage = index;
        scrollToThumbnail(index);
    }
};

let stretchPosition = 0;
let stretch = 0;
onMount(() => {
    const scrollEventListener = () => {
        const clientWidth = slideWrapper?.clientWidth || 0;
        stretchPosition = (slideWrapper?.scrollLeft || 0) / clientWidth;
        const temp = stretchPosition % 1;
        if (temp < 0.5) {
            stretch = 2 * temp;
        } else {
            stretch = 2 * (1 - temp);
        }
    };
    slideWrapper?.addEventListener('scroll', scrollEventListener);
    return () => slideWrapper?.removeEventListener('scroll', scrollEventListener);
});
</script>

<div class="image-view">
    <div class="thumbnail-wrapper">
        <div class="thumbnails" bind:this="{thumbnails}">
            {#each product.images ?? [] as image, idx (image.id)}
                <button on:click="{() => scrollToImage(idx)}" class:selected="{idx === currentImage}">
                    <picture>
                        <source srcset="{image.url}" />
                        <img
                            src="{image.url}"
                            alt="{product.title}"
                            loading="{idx === 0 ? 'eager' : 'lazy'}" />
                    </picture>
                </button>
            {/each}
        </div>
    </div>
    <div class="main-image" bind:this="{mainImageWrapper}">
        <div
            class="slide-wrapper"
            style="--imagesCount: {product.images?.length || 0};"
            bind:this="{slideWrapper}"
            role="slider"
            aria-valuenow="{currentImage}"
            tabindex="{currentImage}"
            on:dragstart="{(e) => e.preventDefault()}"
            on:touchstart="{(e) => {
                if (!slideWrapper || zoomed) return;
                lastScrollLeft = slideWrapper.scrollLeft;
                isDragging = true;
                lastTouchX = e.changedTouches[0].clientX;
                lastTouchStartX = lastTouchX;
            }}"
            on:mousemove="{(e) => {
                if (!e.buttons) return;
                if (!slideWrapper) return;
                if (Math.abs(e.movementX) < 2 && !isDragging) {
                    return;
                }
                lastScrollLeft = slideWrapper.scrollLeft;
                slideWrapper.scrollLeft -= e.movementX;
                isDragging = true;
            }}"
            on:touchmove="{(e) => {
                if (!slideWrapper || zoomed) return;
                const touch = e.changedTouches[0];
                const movementX = lastTouchX - touch.clientX;
                lastTouchX = touch.clientX;
                if (Math.abs(movementX) < 2 && !isDragging) {
                    return;
                }
                lastScrollLeft = slideWrapper.scrollLeft;
                slideWrapper.scrollLeft += movementX;
                isDragging = true;
            }}"
            on:mouseup="{dragEndHandler}"
            on:mouseleave="{dragEndHandler}"
            on:touchend="{dragEndHandler}">
            {#each product.images ?? [] as image, idx (image.id)}
                <div class="zoom-container-wrapper">
                    <button
                        class="zoom-container
                        {zoomed && currentImage === idx ? 'zoomed' : ''}
                        {currentImage === idx ? 'current-image' : ''}
                        {isDragging ? 'dragging' : ''}"
                        style="{idx === 0 ? `view-transition-name: product-${product.id};` : ''}"
                        on:click="{(e) => {
                            if (isDragging) {
                                return;
                            }
                            setZoomed(e, !zoomed);
                        }}"
                        on:mouseleave="{(e) => {
                            if (isDragging) {
                                return;
                            }
                            setZoomed(e, false);
                        }}">
                        <picture
                            class="{zoomed && currentImage === idx ? 'zoomed' : ''} {hasZoomTransitions
                                ? 'zoom-transitions'
                                : ''}"
                            style="--translate: {imgTranslate}; --scale: {zoomFactor};
">
                            <source srcset="{image.url}" />
                            <img src="{image.url}" alt="{product.title} {idx + 1}" loading="lazy" />
                        </picture>
                    </button>
                </div>
            {/each}
        </div>
        {#if (product.images ?? []).length > 1}
            <div class="image-indicator" style="{zoomed ? 'display: none;' : 'display: flex;'}">
                <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                {#each product.images ?? [] as _, idx}
                    <div class:active="{currentImage === idx}"></div>
                {/each}
                <div
                    class="stretchy"
                    style="--stretchPosition: {stretchPosition}; --stretchPercent: {stretch};">
                </div>
            </div>
        {/if}
        <button
            class="scroll-button left"
            on:click="{() => {
                if (currentImage > 0) {
                    scrollToImage(currentImage - 1);
                }
            }}"
            class:visible="{currentImage > 0 && !zoomed}">
            <MdiChevronLeft />
        </button>
        <button
            class="scroll-button right"
            on:click="{() => {
                if (currentImage < (product.images?.length || 0) - 1) {
                    scrollToImage(currentImage + 1);
                }
            }}"
            class:visible="{currentImage < (product.images?.length || 0) - 1 && !zoomed}">
            <MdiChevronRight />
        </button>
    </div>
</div>

<style lang="postcss">
.image-view {
    display: grid;
    @media (orientation: portrait) {
        grid-template-rows: auto;
    }
    @media (orientation: landscape) {
        grid-template-columns: minmax(12em, 10em) 10fr;
        height: 100%;
    }
    max-height: 100dvh;
    overflow: hidden;
    position: relative;
    width: 100%;
}

button {
    margin: 0;
}

.thumbnail-wrapper {
    @media (orientation: portrait) {
        display: none;
    }
    grid-column: 1 / span 1;
    position: absolute;
    inset: 0;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-snap-type: y mandatory;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    border-radius: 0.5rem;
    margin-right: 0.5rem;
    &::-webkit-scrollbar {
        display: none;
    }
}

.thumbnails {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    & button {
        box-shadow: none;
        padding: 0%;
        transition: border var(--transitionDuration) ease;
        border: 1px solid transparent;
        overflow: overlay;
        position: relative;
        background: var(--cardColor);
        &:hover,
        &:focus-within,
        &:focus,
        &:active {
            box-shadow: none;
            border: 1px solid color-mix(in srgb, var(--textColor), transparent 50%);
            & img {
                opacity: 0.9;
            }
        }
        overflow: hidden;
        & img {
            opacity: 0.6;
            transition: opacity var(--transitionDuration) ease;
        }
        &.selected img {
            opacity: 1;
        }
    }
}

.main-image {
    display: grid;
    justify-items: center;
    grid-column: 2 / span 1;
    overflow: overlay;
    position: relative;
    /* @media (orientation: landscape) {
        position: absolute;
        inset: 0;
    } */
    &.current-image {
        isolation: isolate;
        z-index: 5;
    }
}
.slide-wrapper {
    /* @media (orientation: landscape) {
        position: absolute;
        inset: 0;
    } */
    display: grid;
    grid-template-columns: repeat(var(--imagesCount), 100%);
    scroll-snap-type: x mandatory;
    scroll-snap-align: start;
    overflow: hidden;
    border-radius: 0.5rem;
}

.zoom-container-wrapper {
    display: grid;
    justify-content: center;
    height: 100%;
    width: 100%;
}

.zoom-container {
    padding: 0;
    border: none;
    cursor: zoom-in;
    box-shadow: none;
    overflow: hidden;
    border-radius: 0;

    height: fit-content;
    width: fit-content;

    &.dragging {
        cursor: grabbing;
    }

    &.zoomed {
        cursor: zoom-out;
    }
    &:hover {
        box-shadow: none;
    }
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
    display: flex;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
    transition:
        scale var(--transitionDuration) ease,
        translate var(--transitionDuration) ease;
}

.image-indicator {
    --gap-padding: 0.5em;
    --size: 0.65em;
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 1em;
    gap: var(--gap-padding);
    left: 50%;
    transform: translateX(-50%);
    padding: var(--gap-padding);
    border-radius: 100vw;
    background-color: rgba(0, 0, 0, 0.55);
    pointer-events: none;

    & > .stretchy {
        --stretchPercent: 0;
        --stretchPosition: 0;
        --width: calc(var(--size) * (1 + var(--stretchPercent)) + var(--gap-padding) * var(--stretchPercent));
        --positionX: calc(var(--stretchPosition) * (var(--size) + var(--gap-padding)));
        position: absolute;
        height: var(--size);
        top: 50%;
        translate: calc(
                -50% * var(--stretchPercent) + var(--positionX) + var(--gap-padding) * 0.5 * var(--stretchPercent)
            ) -50%;
        left: var(--gap-padding);
        background: white;
        width: var(--width);
    }

    & div {
        width: var(--size);
        height: var(--size);
        background: rgba(255 255 255 / 0.5);
        border-radius: 100vw;
        &::after {
            content: '';
            position: absolute;
            inset: 0;
            background: white;
            border-radius: 100vw;
            opacity: 0;
            transition: opacity var(--transitionDuration) 0.01s;
        }
        position: relative;
        &.active::after {
            opacity: 1;
            transition: opacity 0.01s var(--transitionDuration);
        }
    }
}

.scroll-button {
    position: absolute;
    top: 50%;
    width: 3em;
    height: 3em;
    aspect-ratio: 1 / 1;
    transform: translateY(-50%);
    background: black;
    border: none;
    border-radius: 50%;
    padding: 0.25em;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease;
    display: none;
    box-shadow: none;

    & > :global(svg) {
        color: white;
        width: 100%;
        height: 100%;
    }

    &.visible {
        opacity: 0.3;
        @media screen and (orientation: landscape) {
            display: block;
        }
        @media screen and (orientation: portrait) {
            display: none;
        }
    }

    &:hover,
    &:focus,
    &:active {
        opacity: 0.6;
        box-shadow: none;
    }

    &.left {
        left: 1em;
    }

    &.right {
        right: 1em;
    }
}
</style>
