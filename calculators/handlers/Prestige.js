const { getHypixelItemInformationFromId } = require('../../constants/itemsMap');
const { PRESTIGES } = require('../../constants/prestiges');
const { starCosts } = require('../../helper/essenceStars');

/**
 * A handler for Prestige on an item (e.g. crimson).
 *
 * This handler is hardly used any more since you can sell prestiged kuudra armor now. As of the time of writing, the only items
 * that use this handler are Infernal Hollow armor, Fiery Fervor armor, and Internal Fervor armor.
 */
class PrestigeHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.itemId in PRESTIGES;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        if (prices[item.itemId]) return;
        for (const prestigeItem of PRESTIGES[item.itemId]) {
            const foundItem = getHypixelItemInformationFromId(prestigeItem);
            if (foundItem?.upgrade_costs) item.price += starCosts(prices, item.calculation, foundItem?.upgrade_costs, prestigeItem);
            if (foundItem?.prestige?.costs) item.price += starCosts(prices, item.calculation, foundItem?.prestige.costs, prestigeItem);

            if (prices[prestigeItem]) {
                item.calculation.push({
                    id: prestigeItem,
                    type: 'BASE_PRESTIGE_ITEM',
                    price: prices[prestigeItem],
                    count: 1,
                });
                item.price += prices[prestigeItem];
                break;
            }
        }
    }
}

module.exports = PrestigeHandler;
