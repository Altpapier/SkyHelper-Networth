const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const { REFORGES } = require('../../constants/reforges');

/**
 * A handler for the Reforge modifier on an item.
 */
class ReforgeHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return Boolean(item.extraAttributes.modifier) && item.skyblockItem?.category !== 'ACCESSORY';
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const reforge = item.extraAttributes.modifier;

        if (REFORGES[reforge]) {
            const calculationData = {
                id: REFORGES[reforge],
                type: 'REFORGE',
                price: (prices[REFORGES[reforge]] ?? 0) * APPLICATION_WORTH.reforge,
                count: 1,
            };
            item.calculation.push(calculationData);
        }
    }
}

module.exports = ReforgeHandler;
