const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for Necron Blade Scroll modifiers on an item.
 */
class NecronBladeScrollsHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.ability_scroll;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        for (const id of Object.values(item.extraAttributes.ability_scroll)) {
            const calculationData = {
                id,
                type: 'NECRON_SCROLL',
                price: (prices[id.toUpperCase()] ?? 0) * APPLICATION_WORTH.necronBladeScroll,
                count: 1,
            };
            item.price += calculationData.price;
            item.calculation.push(calculationData);
        }
    }
}

module.exports = NecronBladeScrollsHandler;
