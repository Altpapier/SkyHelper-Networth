const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const { prestiges } = require('../../constants/prestiges');

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

// TODO: Remove Prestige

function starCost(prices, upgrade, star) {
    const upgradePrice = upgrade.essence_type ? prices[`ESSENCE_${upgrade.essence_type}`] : prices[upgrade.item_id];
    if (!upgradePrice) return;

    const calculationData = {
        id: upgrade.essence_type ? `${upgrade.essence_type}_ESSENCE` : upgrade.item_id,
        type: star ? 'STAR' : 'PRESTIGE',
        price: (upgrade.amount || 0) * (upgradePrice || 0) * (upgrade.essence_type ? APPLICATION_WORTH.essence : 1),
        count: upgrade.amount || 0,
    };
    if (star) calculationData.star = star;
    return calculationData;
}

function starCosts(prices, calculation, upgrades, prestigeItem) {
    let price = 0;
    let star = 0;
    const datas = [];
    for (const upgrade of upgrades) {
        star++;
        let data;
        if (upgrade instanceof Array) {
            for (const cost of upgrade) {
                data = starCost(prices, cost, star);
                datas.push(data);
                if (!prestigeItem && data) {
                    price += data.price;
                    calculation.push(data);
                }
            }
        } else {
            data = starCost(prices, upgrade);
            datas.push(data);
            if (!prestigeItem && data) {
                price += data.price;
                calculation.push(data);
            }
        }
    }

    if (prestigeItem && datas.length && datas?.[0]) {
        const prestige = datas[0].type === 'prestige';
        const calculationData = datas.reduce(
            (acc, val) => {
                acc.price += val?.price || 0;
                return acc;
            },
            { id: prestigeItem, type: prestige ? 'prestige' : 'stars', price: 0, count: prestige ? 1 : star }
        );

        if (prestige && prices[prestigeItem.toLowerCase()]) calculationData.price += prices[prestigeItem.toLowerCase()];
        price += calculationData.price;
        calculation.push(calculationData);
    }
    return price;
}

module.exports = EssenceStarsHandler;
