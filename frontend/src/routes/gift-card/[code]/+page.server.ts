import { medusa } from '$/lib/medusa';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async ({ params }) => {

    let giftCard;
    try {
        giftCard = await medusa.giftCards.retrieve(params.code);
        if (giftCard.gift_card.balance <= 0) {
            throw error(404, 'Not found');
        }
        if (giftCard.gift_card.is_disabled) {
            throw error(404, 'Not found');
        }
    } catch (e) {
        console.error(e);
        throw error(404, 'Not found');
    }

    return {
        code: params.code,
        balance: giftCard.gift_card.balance
    };

};
