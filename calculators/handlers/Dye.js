const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for a Dye on an item.
 */
class DyeHandler {
    /**
     * Checks if the handler is cosmetic
     * @returns {boolean} Whether the handler is cosmetic
     */
    isCosmetic() {
        return true;
    }

    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.dye_item;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const calculationData = {
            id: item.extraAttributes.dye_item,
            type: 'DYE',
            price: (prices[item.extraAttributes.dye_item.toUpperCase()] ?? 0) * APPLICATION_WORTH.dye,
            count: 1,
        };
        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = DyeHandler;
