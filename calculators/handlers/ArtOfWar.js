const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for The Art Of War modifier on an item.
 */
class ArtOfWarHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.art_of_war_count;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const artOfWarCount = Number(item.extraAttributes.art_of_war_count);

        const calculationData = {
            id: 'THE_ART_OF_WAR',
            type: 'THE_ART_OF_WAR',
            price: (prices['THE_ART_OF_WAR'] ?? 0) * artOfWarCount * APPLICATION_WORTH.artOfWar,
            count: artOfWarCount,
        };
        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = ArtOfWarHandler;
