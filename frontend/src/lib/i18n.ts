import { PUBLIC_DEFAULT_LANGUAGE, PUBLIC_LANGUAGES } from '$env/static/public';
import i18n from 'sveltekit-i18n';
/** @type {import('sveltekit-i18n').Config} */
const config = ({
    loaders: [
        ...PUBLIC_LANGUAGES.split(',')
            .map((lng) => ({
                locale: lng,
                key: '',
                loader: async () => (
                    await import(`./locales/${lng}.json`).catch(() => ({ default: {} }))
                ).default
            }))
    ],
    initLocale: PUBLIC_DEFAULT_LANGUAGE,
    log: {
        level: 'error'
    }
});

export const { t, locale, locales, loading, loadTranslations, setLocale } = new i18n(config as ConstructorParameters<typeof i18n>[0]);
