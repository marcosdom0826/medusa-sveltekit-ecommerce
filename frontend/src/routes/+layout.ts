import type { LayoutLoad } from './$types';
import { loadTranslations, locales } from '$/lib/i18n';
import { browser } from '$app/environment';

export const trailingSlash = 'always';

export const load: LayoutLoad = async ({ data, url }) => {

    const localeToLoad = url.searchParams.get('locale')
        || (browser ? navigator?.language?.slice(0, 2) : undefined)
        || 'de'; // TODO: get from cookie or something
    if (locales.get().includes(localeToLoad) || locales.get().length === 0) {
        await loadTranslations(localeToLoad);
    }
    return data;
};
