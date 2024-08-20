const { ALLOWED_RECOMBOBULATED_CATEGORIES, ALLOWED_RECOMBOBULATED_IDS } = require('../../../constants/misc');
const { APPLICATION_WORTH } = require('../../../constants/applicationWorth');

class RecombobulatorHandler {
    static applies({ itemLore, skyblockItem, itemData, itemId }) {
        const allowsRecomb = ALLOWED_RECOMBOBULATED_CATEGORIES.includes(skyblockItem.category) || ALLOWED_RECOMBOBULATED_IDS.includes(itemId);
        const lastLoreLine = itemLore.length ? itemLore.at(-1) : null;
        const isAccessory = lastLoreLine?.includes('ACCESSORY') || lastLoreLine?.includes('HATCESSORY');

        return /*isRecombobulated() ||*/ itemData.tag.ExtraAttributes.enchantments || isAccessory || allowsRecomb;
    }

    static calculate({ itemId, price, calculation }, prices) {
        const recombobulatorApplicationWorth = itemId === 'bone_boomerang' ? APPLICATION_WORTH.recombobulator * 0.5 : APPLICATION_WORTH.recombobulator;
        const calculationData = {
            id: 'RECOMBOBULATOR_3000',
            type: 'recombobulator_3000',
            price: (prices['recombobulator_3000'] || 0) * recombobulatorApplicationWorth,
            count: 1,
        };

        price += calculationData.price;
        calculation.push(calculationData);
    }
}

module.exports = RecombobulatorHandler;
