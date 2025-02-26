const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for Jalapeno Book modifier on an item.
 */
class JalapenoBookHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.jalapeno_count > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const calculationData = {
            id: 'JALAPENO_BOOK',
            type: 'JALAPENO_BOOK',
            price: (prices['JALAPENO_BOOK'] ?? 0) * item.extraAttributes.jalapeno_count * APPLICATION_WORTH.jalapenoBook,
            count: item.extraAttributes.jalapeno_count,
        };
        item.calculation.push(calculationData);
    }
}

module.exports = JalapenoBookHandler;
