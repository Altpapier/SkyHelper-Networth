const { starCosts } = require('../../helper/essenceStars');

/**
 * A handler for Essence Stars on an item.
 */
class EssenceStarsHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        const dungeonItemLevel = parseInt((item.extraAttributes.dungeon_item_level || 0).toString().replace(/\D/g, ''));
        const upgradeLevel = parseInt((item.extraAttributes.upgrade_level || 0).toString().replace(/\D/g, ''));
        return item.skyblockItem?.upgrade_costs && (dungeonItemLevel > 0 || upgradeLevel > 0);
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const dungeonItemLevel = parseInt((item.extraAttributes.dungeon_item_level || 0).toString().replace(/\D/g, ''));
        const upgradeLevel = parseInt((item.extraAttributes.upgrade_level || 0).toString().replace(/\D/g, ''));
        const level = Math.max(dungeonItemLevel, upgradeLevel);
        item.price += starCosts(prices, item.calculation, item.skyblockItem.upgrade_costs.slice(0, level + 1));
    }
}

module.exports = EssenceStarsHandler;
