const { ALLOWED_RECOMBOBULATED_CATEGORIES, ALLOWED_RECOMBOBULATED_IDS } = require('../../constants/misc');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

class RecombobulatorHandler {
    applies(item) {
        const allowsRecomb = ALLOWED_RECOMBOBULATED_CATEGORIES.includes(item.skyblockItem.category) || ALLOWED_RECOMBOBULATED_IDS.includes(item.itemId);
        const lastLoreLine = item.itemLore.length ? item.itemLore.at(-1) : null;
        const isAccessory = lastLoreLine?.includes('ACCESSORY') || lastLoreLine?.includes('HATCESSORY');

        return item.isRecombobulated() || item.itemData.tag.ExtraAttributes.enchantments || isAccessory || allowsRecomb;
    }

    calculate(item, prices) {
        const recombobulatorApplicationWorth = item.itemId === 'BONE_BOOMERANG' ? APPLICATION_WORTH.recombobulator * 0.5 : APPLICATION_WORTH.recombobulator;
        const calculationData = {
            id: 'RECOMBOBULATOR_3000',
            type: 'RECOMBOBULATOR_3000',
            price: (prices['RECOMBOBULATOR_3000'] || 0) * recombobulatorApplicationWorth,
            count: 1,
        };

        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = RecombobulatorHandler;
