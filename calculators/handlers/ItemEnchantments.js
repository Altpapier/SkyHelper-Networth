const { APPLICATION_WORTH, ENCHANTMENTS_WORTH } = require('../../constants/applicationWorth');
const { BLOCKED_ENCHANTMENTS, IGNORED_ENCHANTMENTS, STACKING_ENCHANTMENTS, IGNORE_SILEX } = require('../../constants/misc');

/**
 * A handler for the enchantments on an item.
 */
class ItemEnchantmentsHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.itemId !== 'ENCHANTED_BOOK' && Object.keys(item.extraAttributes.enchantments || {}).length > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        for (let [name, value] of Object.entries(item.extraAttributes.enchantments)) {
            name = name.toUpperCase();
            if (BLOCKED_ENCHANTMENTS[item.itemId]?.includes(name)) continue;
            if (IGNORED_ENCHANTMENTS[name] === value) continue;

            // STACKING ENCHANTS
            if (STACKING_ENCHANTMENTS.includes(name)) value = 1;

            // SILEX
            if (name === 'EFFICIENCY' && value > 5 && !IGNORE_SILEX.includes(item.itemId)) {
                const efficiencyLevel = value - (item.itemId === 'STONK_PICKAXE' ? 6 : 5);

                if (efficiencyLevel > 0) {
                    const calculationData = {
                        id: 'SIL_EX',
                        type: 'SILEX',
                        price: (prices['SIL_EX'] ?? 0) * efficiencyLevel * APPLICATION_WORTH.silex,
                        count: efficiencyLevel,
                    };
                    item.price += calculationData.price;
                    item.calculation.push(calculationData);
                }
            }

            // GOLDEN BOUNTY
            if (name === 'SCAVENGER' && value >= 6) {
                const calculationData = {
                    id: 'GOLDEN_BOUNTY',
                    type: 'GOLDEN_BOUNTY',
                    price: (prices['GOLDEN_BOUNTY'] ?? 0) * APPLICATION_WORTH.goldenBounty,
                    count: 1,
                };
                item.price += calculationData.price;
                item.calculation.push(calculationData);
            }

            // A Beginner's Guide To Pesthunting
            if (name === 'pesterminator' && value >= 6) {
                const calculationData = {
                    id: 'PESTHUNTING_GUIDE',
                    type: 'PESTHUNTING_GUIDE',
                    price: (prices['PESTHUNTING_GUIDE'] ?? 0) * APPLICATION_WORTH.pesthuntingGuide,
                    count: 1,
                };
                item.price += calculationData.price;
                item.calculation.push(calculationData);
            }

            const calculationData = {
                id: `${name}_${value}`,
                type: 'ENCHANTMENT',
                price: (prices[`ENCHANTMENT_${name}_${value}`] ?? 0) * (ENCHANTMENTS_WORTH[name] || APPLICATION_WORTH.enchants),
                count: 1,
            };
            if (calculationData.price) {
                item.price += calculationData.price;
                item.calculation.push(calculationData);
            }
        }
    }
}

module.exports = ItemEnchantmentsHandler;
