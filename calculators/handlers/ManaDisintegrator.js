const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for Mana Disintegrator modifier on an item.
 */
class ManaDisintegratorHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.mana_disintegrator_count > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const calculationData = {
            id: 'MANA_DISINTEGRATOR',
            type: 'MANA_DISINTEGRATOR',
            price: (prices['MANA_DISINTEGRATOR'] ?? 0) * item.extraAttributes.mana_disintegrator_count * APPLICATION_WORTH.manaDisintegrator,
            count: item.extraAttributes.mana_disintegrator_count,
        };
        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = ManaDisintegratorHandler;
