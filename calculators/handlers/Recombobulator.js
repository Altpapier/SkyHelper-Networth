const { ALLOWED_RECOMBOBULATED_CATEGORIES, ALLOWED_RECOMBOBULATED_IDS } = require('../../constants/misc');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

class RecombobulatorHandler {
    isValid(item) {
        const allowsRecomb = ALLOWED_RECOMBOBULATED_CATEGORIES.includes(item.skyblockItem.category) || ALLOWED_RECOMBOBULATED_IDS.includes(itemId);
        const isAccessory = lastLoreLine?.includes('ACCESSORY') || lastLoreLine?.includes('HATCESSORY');
        const lastLoreLine = itemLore.length ? itemLore.at(-1) : null;

        return item.isRecombobulated() || ExtraAttributes.enchantments || isAccessory || allowsRecomb;
    }

    calculate(item, prices) {
        const recombApplicationWorth = itemId === 'bone_boomerang' ? APPLICATION_WORTH.recombobulator * 0.5 : APPLICATION_WORTH.recombobulator;
        const calculationData = {
            id: 'RECOMBOBULATOR_3000',
            type: 'recombobulator_3000',
            price: (prices['recombobulator_3000'] || 0) * recombApplicationWorth,
            count: 1,
        };

        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = RecombobulatorHandler;
