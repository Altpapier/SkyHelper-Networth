const { APPLICATION_WORTH, enchantsWorth } = require('../../constants/applicationWorth');
const { blockedEnchants, ignoredEnchants, stackingEnchants, ignoreSilex } = require('../../constants/misc');

/**
 * A handler for the enchantments on an item.
 */
class ItemEnchantmentHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.itemId !== 'ENCHANTED_BOOK' && item.extraAttributes.enchantments;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        for (let [name, value] of Object.entries(item.extraAttributes.enchantments)) {
            name = name.toUpperCase();
            if (blockedEnchants[item.itemId]?.includes(name)) continue;
            if (ignoredEnchants[name] === value) continue;

            // STACKING ENCHANTS
            if (stackingEnchants.includes(name)) value = 1;

            // SILEX
            if (name === 'EFFICIENCY' && value > 5 && !ignoreSilex.includes(item.itemId)) {
                const efficiencyLevel = value - (item.itemId === 'STONK_PICKAXE' ? 6 : 5);

                if (efficiencyLevel > 0) {
                    const calculationData = {
                        id: 'SIL_EX',
                        type: 'SILEX',
                        price: (prices['SIL_EX'] || 0) * efficiencyLevel * APPLICATION_WORTH.silex,
                        count: efficiencyLevel,
                    };
                    item.price += calculationData.price;
                    item.calculation.push(calculationData);
                }
            }

            // GOLDEN BOUNTY (scavenger 6+: https://hypixel.net/threads/scavenger-7-now-obtainable.5741331/, NEED MORE INFO! before: value === 6)
            if (name === 'SCAVENGER' && value >= 6) {
                const calculationData = {
                    id: 'GOLDEN_BOUNTY',
                    type: 'GOLDEN_BOUNTY',
                    price: (prices['GOLDEN_BOUNTY'] || 0) * APPLICATION_WORTH.goldenBounty,
                    count: 1,
                };
                item.price += calculationData.price;
                item.calculation.push(calculationData);
            }

            const calculationData = {
                id: `${name}_${value}`,
                type: 'ENCHANT',
                price: (prices[`ENCHANTMENT_${name}_${value}`] || 0) * (enchantsWorth[name] || APPLICATION_WORTH.enchants),
                count: 1,
            };
            if (calculationData.price) {
                item.price += calculationData.price;
                item.calculation.push(calculationData);
            }
        }
    }
}

module.exports = ItemEnchantmentHandler;
