<script lang="ts">
import InputField from '$/lib/components/InputField.svelte';
import { enhance, applyAction } from '$app/forms';
import LoadingSpinner from '$/lib/components/LoadingSpinner.svelte';

let htmlForm: HTMLFormElement;
let formValid = $state(false);
let loading = $state(false);
</script>

<div class="wrapper">
    <h1>Reset Password</h1>
    <form
        id="reset-form"
        method="post"
        action="?/requestReset"
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
        <InputField field="email" label="Email" type="email" required />
        <button type="submit" class="primary" form="reset-form" disabled="{loading || !formValid}">
            {#if loading}
                <LoadingSpinner size="1.3em" ringWidth="0.25em" />
            {:else}
                Reset Password
            {/if}
        </button>
        <a href="/account/login" class="link">Return to login</a>
        <a href="/account/register" class="link">No account yet? - Register</a>
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

.link {
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
