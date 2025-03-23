const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const { ATTRIBUTE_BASE_COSTS } = require('../../constants/misc');

/**
 * A handler for the attributes modifier on an item.
 */
class AttributesHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return Object.keys(item.extraAttributes.attributes ?? {}).length > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        for (const [attribute, tier] of Object.entries(item.extraAttributes.attributes)) {
            if (tier === 1) continue;
            const attributeName = attribute.toUpperCase();
            // Base price times the amount needed to get that tier which is 2^tier - 1 because of the base item
            const shards = 2 ** (tier - 1) - 1;
            let baseAttributePrice = prices[`ATTRIBUTE_SHARD_${attributeName}`];
            if (ATTRIBUTE_BASE_COSTS[item.itemId] && prices[ATTRIBUTE_BASE_COSTS[item.itemId]] < baseAttributePrice) {
                baseAttributePrice = prices[ATTRIBUTE_BASE_COSTS[item.itemId]];
            } else if (
                /^(|HOT_|FIERY_|BURNING_|INFERNAL_)(AURORA|CRIMSON|TERROR|HOLLOW|FERVOR)_HELMET$/.test(item.itemId) &&
                (!baseAttributePrice || prices[`KUUDRA_HELMET_${attributeName}`] < baseAttributePrice)
            ) {
                baseAttributePrice = prices[`KUUDRA_HELMET_${attributeName}`];
            } else if (/^(|HOT_|FIERY_|BURNING_|INFERNAL_)(AURORA|CRIMSON|TERROR|HOLLOW|FERVOR)(_CHESTPLATE|_LEGGINGS|_BOOTS)$/.test(item.itemId)) {
                const kuudraPrices = [
                    prices[`KUUDRA_CHESTPLATE_${attributeName}`],
                    prices[`KUUDRA_LEGGINGS_${attributeName}`],
                    prices[`KUUDRA_BOOTS_${attributeName}`],
                ].filter((v) => v);
                const kuudraPrice = kuudraPrices.reduce((a, b) => a + b, 0) / kuudraPrices.length;
                if (kuudraPrice && (!baseAttributePrice || kuudraPrice < baseAttributePrice)) baseAttributePrice = kuudraPrice;
            }
            if (!baseAttributePrice) continue;
            const attributePrice = baseAttributePrice * shards * APPLICATION_WORTH.attributes;

            item.price += attributePrice;
            item.calculation.push({
                id: `${attributeName}_${tier}`.toUpperCase(),
                type: 'ATTRIBUTE',
                price: attributePrice,
                count: 1,
                shards,
            });
        }
    }
}

module.exports = AttributesHandler;
