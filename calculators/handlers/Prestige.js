const { getHypixelItemInformationFromId } = require('../../constants/itemsMap');
const { PRESTIGES } = require('../../constants/prestiges');
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
        return PRESTIGES[item.itemId];
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        if (prices[item.itemId]) return;
        const prestige = PRESTIGES[item.itemId];
        for (const prestigeItem of prestige) {
            const foundItem = getHypixelItemInformationFromId(prestigeItem);
            if (isNaN(item.price)) item.price = 0;
            if (foundItem?.upgrade_costs) {
                const calculationData = {
                    id: prestigeItem,
                    type: 'PRESTIGE',
                    price: starCosts(prices, item.calculation, foundItem?.upgrade_costs, prestigeItem),
                    count: 1,
                };

                item.calculation.push(calculationData);
            }
            if (foundItem?.prestige?.costs) {
                const calculationData = {
                    id: prestigeItem,
                    type: 'PRESTIGE',
                    price: starCosts(prices, item.calculation, foundItem?.prestige.costs, prestigeItem),
                    count: 1,
                };

                item.calculation.push(calculationData);
            }
        }
    }
}

module.exports = PrestigeHandler;
