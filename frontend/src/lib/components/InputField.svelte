<script lang="ts">
import type { Snippet } from 'svelte';

/* eslint-disable prefer-const */
let {
    fieldErrors,
    value = $bindable(),
    field,
    label,
    type,
    required,
    hint,
    requiredStar,
    style,
    children,
    autocomplete
}: {
    fieldErrors?: Record<string, unknown>;
    value?: unknown;
    field: string;
    label: string;
    type: string;
    required?: boolean;
    hint?: string;
    requiredStar?: boolean;
    style?: string;
    children?: Snippet;
    autocomplete?: string;
} = $props();
/* eslint-enable prefer-const */
</script>

<label for="{field}" style="{style}" class:field-error="{fieldErrors?.[field]}">
    <input
        name="{field}"
        autocomplete="{autocomplete}"
        type="{type}"
        placeholder="{hint || label}{required && requiredStar ? ' *' : ''}"
        required="{required}"
        id="{field}"
        oninput="{() => {
            if (fieldErrors?.[field]) fieldErrors[field] = '';
        }}"
        bind:value="{value}" />
    <span class="label">{label}{required && requiredStar ? ' *' : ''}</span>
    {#if children}
        {@render children()}
    {/if}
</label>

<style lang="postcss">
label {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto min-content;
    align-items: center;
    position: relative;
    isolation: isolate;
    width: 100%;

    & > * {
        grid-column: 1;
        grid-row: 1;
    }

    & input:not([type='radio']) {
        width: 100%;
    }

    & input:focus-visible + .label,
    & input:not(:placeholder-shown) + .label {
        opacity: 1;
        font-size: 0.75em;
        translate: 0 -1.75em;
        background-color: var(--backgroundColor);
    }

    & .label {
        pointer-events: none;
        width: fit-content;
        user-select: none;
        margin: 0 0.5em;
        padding: 0 0.5em;
        opacity: 0.5;
        transition: all var(--transitionDuration) ease;
        border-radius: 0.5em;
    }
}

input::placeholder {
    visibility: hidden;
    opacity: 0;
}

label.field-error {
    & input {
        border-color: red;
    }
}
</style>
