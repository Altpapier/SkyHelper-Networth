const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const { ENRICHMENTS } = require('../../constants/misc');

/**
 * A handler for an Enrichment modifier on an item.
 */
class EnrichmentHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.talisman_enrichment;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const enrichmentPrice = ENRICHMENTS.reduce((acc, val) => Math.min(acc, prices[val] ?? 0), Infinity);
        if (enrichmentPrice !== Infinity) {
            const calculationData = {
                id: item.extraAttributes.talisman_enrichment.toUpperCase(),
                type: 'TALISMAN_ENRICHMENT',
                price: enrichmentPrice * APPLICATION_WORTH.enrichment,
                count: 1,
            };
            item.price += calculationData.price;
            item.calculation.push(calculationData);
        }
    }
}

module.exports = EnrichmentHandler;
