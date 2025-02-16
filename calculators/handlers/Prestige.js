const { getHypixelItemInformationFromId } = require('../../constants/itemsMap');
const prestiges = require('../../constants/prestiges');
const { starCosts } = require('../../helper/essenceStars');

/**
 * A handler for Prestige on an item (e.g. crimson).
 */
class PrestigeHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return prestiges[item.itemId];
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        if (prices[item.itemId]) return;
        const prestige = prestiges[item.itemId];
        for (const prestigeItem of prestige) {
            const foundItem = getHypixelItemInformationFromId(prestigeItem);
            if (isNaN(item.price)) item.price = 0;
            if (foundItem?.upgrade_costs) item.price += starCosts(prices, item.calculation, foundItem?.upgrade_costs, prestigeItem);
            if (foundItem?.prestige?.costs) item.price += starCosts(prices, item.calculation, foundItem?.prestige.costs, prestigeItem);
        }
    }
}

module.exports = PrestigeHandler;
