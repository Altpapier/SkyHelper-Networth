const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for Polarvoid Books on an item.
 */
class PolarvoidBookHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.polarvoid;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const calculationData = {
            id: 'POLARVOID_BOOK',
            type: 'POLARVOID_BOOK',
            price: (prices['POLARVOID_BOOK'] || 0) * item.extraAttributes.polarvoid * APPLICATION_WORTH.polarvoid,
            count: item.extraAttributes.polarvoid,
        };
        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = PolarvoidBookHandler;
