const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const { MASTER_STARS } = require('../../constants/misc');

/**
 * A handler for Master Stars on an item.
 */
class MasterStarsHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        const dungeonItemLevel = parseInt((item.extraAttributes.dungeon_item_level ?? 0).toString().replace(/\D/g, ''));
        const upgradeLevel = parseInt((item.extraAttributes.upgrade_level ?? 0).toString().replace(/\D/g, ''));
        return item.skyblockItem?.upgrade_costs && (dungeonItemLevel > 5 || upgradeLevel > 5);
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const dungeonItemLevel = parseInt((item.extraAttributes.dungeon_item_level ?? 0).toString().replace(/\D/g, ''));
        const upgradeLevel = parseInt((item.extraAttributes.upgrade_level ?? 0).toString().replace(/\D/g, ''));
        const starsUsedDungeons = dungeonItemLevel - 5;
        const starsUsedUpgrade = (upgradeLevel ?? 0) - 5;
        const starsUsed = Math.max(starsUsedDungeons, starsUsedUpgrade);

        if (item.skyblockItem.upgrade_costs.length <= 5) {
            for (const star of Array(starsUsed).keys()) {
                const calculationData = {
                    id: MASTER_STARS[star],
                    type: 'MASTER_STAR',
                    price: (prices[MASTER_STARS[star]] ?? 0) * APPLICATION_WORTH.masterStar,
                    count: 1,
                };
                item.price += calculationData.price;
                item.calculation.push(calculationData);
            }
        }
    }
}

module.exports = MasterStarsHandler;
