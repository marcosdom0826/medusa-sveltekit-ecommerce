import type { LayoutLoad } from './$types';
import { loadTranslations } from '$/lib/i18n';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ data, url }) => {

    await loadTranslations(
        url.searchParams.get('locale')
        || (browser ? navigator?.language?.slice(0, 2) : undefined)
        || 'de'
    ); // TODO: get from cookie or something
    return data;
};
