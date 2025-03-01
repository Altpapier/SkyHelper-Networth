const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for the Pocket Sack-in-a-Sack modifier on an item.
 */
class PocketSackInASackHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.sack_pss > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const calculationData = {
            id: 'POCKET_SACK_IN_A_SACK',
            type: 'POCKET_SACK_IN_A_SACK',
            price: (prices['POCKET_SACK_IN_A_SACK'] ?? 0) * item.extraAttributes.sack_pss * APPLICATION_WORTH.pocketSackInASack,
            count: item.extraAttributes.sack_pss,
        };
        item.calculation.push(calculationData);
    }
}

module.exports = PocketSackInASackHandler;
