const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for the Overclocker 3000 modifier on an item.
 */
class Overclocker3000Handler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.levelable_overclocks > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const calculationData = {
            id: 'OVERCLOCKER_3000',
            type: 'OVERCLOCKER_3000',
            price: (prices['OVERCLOCKER_3000'] ?? 0) * item.extraAttributes.levelable_overclocks * APPLICATION_WORTH.overclocker3000,
            count: item.extraAttributes.levelable_overclocks,
        };
        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = Overclocker3000Handler;
