import i18next from 'i18next';
import { createI18nStore } from 'svelte-i18next';
import { PUBLIC_DEFAULT_LANGUAGE } from '$env/static/public';
import { PUBLIC_LANGUAGES } from '$env/static/public';


const init = async () => {
    const lngs = await Promise.all(PUBLIC_LANGUAGES.split(',')
        .map(async (lang) => (
            await import(`./locales/${lang}.json`)
                .catch(() => ({ default: {} }))
        ).default));
    await i18next.init({
        lng: PUBLIC_DEFAULT_LANGUAGE,
        resources: {
            ...PUBLIC_LANGUAGES.split(',').reduce((acc, lang, idx) => ({
                ...acc,
                [lang]: {
                    translation: lngs[idx]
                }
            }), {})
        },
        interpolation: {
            escapeValue: false // not needed for svelte as it escapes by default
        }
    });
};
void init();

export default () => createI18nStore(i18next);
export type I18nStore = ReturnType<typeof createI18nStore>;
