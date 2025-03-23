const { ALLOWED_RECOMBOBULATED_CATEGORIES, ALLOWED_RECOMBOBULATED_IDS } = require('../../constants/misc');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for the Recombobulator 3000 modifier on an item
 */
class RecombobulatorHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        const hasEnchantments = Object.keys(item.extraAttributes.enchantments || {}).length > 0;
        const allowsRecomb = ALLOWED_RECOMBOBULATED_CATEGORIES.includes(item.skyblockItem.category) || ALLOWED_RECOMBOBULATED_IDS.includes(item.itemId);
        const lastLoreLine = item.itemLore.length ? item.itemLore.at(-1) : '';
        const isAccessory = lastLoreLine?.includes('ACCESSORY') || lastLoreLine?.includes('HATCESSORY');
        return item.isRecombobulated() && (hasEnchantments || allowsRecomb || isAccessory);
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const recombobulatorApplicationWorth = item.itemId === 'BONE_BOOMERANG' ? APPLICATION_WORTH.recombobulator * 0.5 : APPLICATION_WORTH.recombobulator;
        const calculationData = {
            id: 'RECOMBOBULATOR_3000',
            type: 'RECOMBOBULATOR_3000',
            price: (prices['RECOMBOBULATOR_3000'] ?? 0) * recombobulatorApplicationWorth,
            count: 1,
        };

        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = RecombobulatorHandler;
