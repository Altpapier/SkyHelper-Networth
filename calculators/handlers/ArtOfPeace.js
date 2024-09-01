const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for The Art Of Peace modifier on an item.
 */
class ArtOfPeaceHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.artOfPeaceApplied;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const calculationData = {
            id: 'THE_ART_OF_PEACE',
            type: 'THE_ART_OF_PEACE',
            price: (prices['THE_ART_OF_PEACE'] || 0) * item.extraAttributes.artOfPeaceApplied * APPLICATION_WORTH.artOfPeace,
            count: item.extraAttributes.artOfPeaceApplied,
        };
        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = ArtOfPeaceHandler;
