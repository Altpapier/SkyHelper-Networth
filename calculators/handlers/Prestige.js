const { prestiges } = require('../../constants/prestiges');
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
        return !item.price && prestiges[item.itemId];
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const prestige = prestiges[item.itemId];
        for (const prestigeItem of prestige) {
            if (isNaN(item.price)) item.price = 0;
            if (item.skyblockItem?.upgrade_costs) item.price += starCosts(prices, item.calculation, item.skyblockItem.upgrade_costs, prestigeItem);
            if (item.skyblockItem?.prestige?.costs) item.price += starCosts(prices, item.calculation, item.skyblockItem.prestige.costs, prestigeItem);
        }
    }
}

module.exports = PrestigeHandler;
