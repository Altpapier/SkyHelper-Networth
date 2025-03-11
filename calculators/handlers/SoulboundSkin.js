const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for the Soulbound Skin modifier on a item.
 */
class SoulboundSkinHandler {
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
        return Boolean(item.extraAttributes.skin) && !item.itemId.includes(item.extraAttributes.skin) && item.isSoulbound() && !item.nonCosmetic;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        if (!prices[item.extraAttributes.skin]) {
            return;
        }

        const calculationData = {
            id: item.extraAttributes.skin,
            type: 'SOULBOUND_SKIN',
            price: (prices[item.extraAttributes.skin] ?? 0) * APPLICATION_WORTH.soulboundSkins,
            count: 1,
        };

        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = SoulboundSkinHandler;
