const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for Wood Singularity modifier on an item.
 */
class WoodSingularityHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.wood_singularity_count > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const calculationData = {
            id: 'WOOD_SINGULARITY',
            type: 'WOOD_SINGULARITY',
            price: (prices['WOOD_SINGULARITY'] ?? 0) * item.extraAttributes.wood_singularity_count * APPLICATION_WORTH.woodSingularity,
            count: item.extraAttributes.wood_singularity_count,
        };
        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = WoodSingularityHandler;
