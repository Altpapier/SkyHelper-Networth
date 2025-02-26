const { starCosts } = require('../../helper/essenceStars');

/**
 * A handler for Essence Stars on an item.
 */
class EssenceStarsHandler {
    /**
     * Get the item's upgrade level
     * @param {object} item The item data
     * @returns {number} The upgrade level of the item
     */
    #getUpgradeLevel(item) {
        const dungeonItemLevel = parseInt((item.extraAttributes.dungeon_item_level ?? 0).toString().replace(/\D/g, ''));
        const upgradeLevel = parseInt((item.extraAttributes.upgrade_level ?? 0).toString().replace(/\D/g, ''));
        return Math.max(dungeonItemLevel, upgradeLevel);
    }

    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.skyblockItem?.upgrade_costs?.length > 0 && this.#getUpgradeLevel(item) > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const level = this.#getUpgradeLevel(item);
        console.log('Level:', level);
        console.log(item.skyblockItem.upgrade_costs.slice(0, level));
        const calculationData = {
            id: 'ESSENCE_STARS',
            type: 'ESSENCE_STARS',
            price: starCosts(prices, item.calculation, item.skyblockItem.upgrade_costs.slice(0, level)),
            count: level,
        };

        item.calculation.push(calculationData);
    }
}

module.exports = EssenceStarsHandler;
