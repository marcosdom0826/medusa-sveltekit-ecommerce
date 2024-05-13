<script lang="ts">
import InputField from '$/lib/components/InputField.svelte';
import MdiEyeOutline from '~icons/mdi/eye-outline';
import MdiEyeOffOutline from '~icons/mdi/eye-off-outline';
import LoadingSpinner from '$/lib/components/LoadingSpinner.svelte';
import { applyAction, enhance } from '$app/forms';
import { fade } from 'svelte/transition';
import type { PageData } from './$types';
import { page } from '$app/stores';

const { data }: { data: PageData } = $props();

let passwordShown = $state(false);
let htmlForm: HTMLFormElement;
let formValid = $state(false);
let loading = $state(false);
let pw = $state('');
let repeatPw = $state('');

page;
const email = $page.url.searchParams.get('email');
$inspect({ data });
</script>

<div class="wrapper">
    <h1>Reset Password</h1>
    <form
        id="reset-form"
        method="post"
        bind:this="{htmlForm}"
        oninput="{() => {
            formValid = htmlForm.checkValidity();
        }}"
        use:enhance="{async () => {
            loading = true;
            return async ({ update, result }) => {
                await update({ reset: false });
                loading = false;
                await applyAction(result);
            };
        }}">
        <InputField
            field="email"
            label="Email"
            type="email"
            required
            autocomplete="username"
            value="{email}" />
        <InputField
            autocomplete="new-password"
            field="password"
            label="Password"
            type="{passwordShown ? 'text' : 'password'}"
            required
            bind:value="{pw}">
        </InputField>
        <InputField
            autocomplete="new-password"
            field="repeat-password"
            label="Repeat Password"
            type="{passwordShown ? 'text' : 'password'}"
            required
            bind:value="{repeatPw}">
            <button type="button" class="show-pw-button" onclick="{() => (passwordShown = !passwordShown)}">
                {#if passwordShown}
                    <div transition:fade|local="{{ duration: 200 }}">
                        <MdiEyeOffOutline />
                    </div>
                {:else}
                    <div transition:fade|local="{{ duration: 200 }}">
                        <MdiEyeOutline />
                    </div>
                {/if}
            </button>
        </InputField>
        <input type="hidden" name="token" value="{data.token}" />
        <button
            type="submit"
            class="primary"
            form="reset-form"
            disabled="{loading || !formValid || pw !== repeatPw}">
            {#if loading}
                <LoadingSpinner size="1.3em" ringWidth="0.25em" />
            {:else}
                Reset Password
            {/if}
        </button>
    </form>
</div>

<style lang="postcss">
h1 {
    margin-bottom: 1em;
}

.wrapper {
    display: grid;
    justify-items: center;
    height: fit-content;
    gap: 0.5em;
    padding: 2rem;
    & > form {
        height: fit-content;
        display: grid;
        justify-items: center;
        gap: 1em;
        width: min(100%, 42ch);
        & > * {
            width: 100%;
        }
    }
}

.show-pw-button {
    position: absolute;
    right: 0;
    top: 0;
    padding: 0.25em;
    border: none;
    background-color: transparent;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: none;
    opacity: 0.5;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    place-items: center;
    & > * {
        grid-column: 1;
        grid-row: 1;
    }
    &:hover,
    &:focus-visible {
        opacity: 1;
    }
}

.login-link {
    width: 100%;
    text-align: center;
}

a {
    color: var(--textColor);
    &:hover {
        opacity: 0.5;
    }
}
</style>
