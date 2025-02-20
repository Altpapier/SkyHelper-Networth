const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for Divan's Powder Coating on an item.
 */
class DivanPowderCoatingHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.divan_powder_coating;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const calculationData = {
            id: 'DIVAN_POWDER_COATING',
            type: 'DIVAN_POWDER_COATING',
            price: (prices['DIVAN_POWDER_COATING'] ?? 0) * APPLICATION_WORTH.divanPowderCoating,
            count: item.extraAttributes.divan_powder_coating,
        };
        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = DivanPowderCoatingHandler;
