const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for the Farming For Dummies modifier on an item.
 */
class FarmingForDummiesHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.farming_for_dummies_count > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const calculationData = {
            id: 'FARMING_FOR_DUMMIES',
            type: 'FARMING_FOR_DUMMIES',
            price: (prices['FARMING_FOR_DUMMIES'] ?? 0) * item.extraAttributes.farming_for_dummies_count * APPLICATION_WORTH.farmingForDummies,
            count: item.extraAttributes.farming_for_dummies_count,
        };
        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = FarmingForDummiesHandler;
