<script lang="ts">
import InputField from '$/lib/components/InputField.svelte';
import MdiEyeOutline from '~icons/mdi/eye-outline';
import MdiEyeOffOutline from '~icons/mdi/eye-off-outline';
import { fade } from 'svelte/transition';
import { enhance, applyAction } from '$app/forms';
import LoadingSpinner from '$/lib/components/LoadingSpinner.svelte';
import type { ActionData } from './$types';
import { page } from '$app/stores';

const { form }: { form: ActionData & { error?: string } } = $props();

let passwordShown = $state(false);
let htmlForm: HTMLFormElement;
let formValid = $state(false);
let loading = $state(false);
let pw = $state('');

page;
const redirect = $page.url.searchParams.get('redirect');
</script>

<div class="wrapper">
    <h1>Login</h1>
    <form
        id="login-form"
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
        <InputField field="email" label="Email" type="email" required autocomplete="username" />
        <InputField
            field="password"
            label="Password"
            autocomplete="current-password"
            type="{passwordShown ? 'text' : 'password'}"
            required
            bind:value="{pw}">
            <button
                transition:fade="{{ duration: 200 }}"
                type="button"
                class="show-pw-button"
                onclick="{() => (passwordShown = !passwordShown)}">
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
        <input type="hidden" name="redirect" value="{redirect}" />
        {#if form?.error}
            {#if form?.error === 'Unauthorized'}
                <span class="error">Email or password incorrect</span>
            {:else}
                <span class="error">Unknown Error</span>
            {/if}
        {/if}
        <button type="submit" class="primary" form="login-form" disabled="{loading || !formValid}">
            {#if loading}
                <LoadingSpinner size="1.3em" ringWidth="0.25em" />
            {:else}
                Login
            {/if}
        </button>
        <a href="/account/reset" class="reset-link">Forgot your password?</a>
        <a href="/account/register" class="register-link">No account yet? - Register</a>
    </form>
</div>

<style lang="postcss">
h1 {
    margin-bottom: 1em;
}

.error {
    color: rgb(207, 0, 0);
    font-weight: bold;
    padding: 0.25em 0;
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

.register-link {
    width: 100%;
    text-align: center;
}

.reset-link {
    text-align: end;
    font-size: 0.8em;
    opacity: 0.75;
    text-decoration: none;
    &:hover {
        opacity: 1;
        text-decoration: underline;
    }
}

a {
    color: var(--textColor);
    &:hover {
        opacity: 0.5;
    }
}
</style>
