const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const { SPECIAL_ENCHANTMENT_NAMES } = require('../../constants/misc');
const { titleCase } = require('../../helper/functions');

/**
 * A handler for the price of enchanted books.
 */
class EnchantedBookHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.itemId === 'ENCHANTED_BOOK' && item.extraAttributes.enchantments;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        // ENCHANTMENT BOOK
        if (Object.keys(item.extraAttributes.enchantments).length === 1) {
            const [name, value] = Object.entries(item.extraAttributes.enchantments)[0];

            const calculationData = {
                id: `${name}_${value}`.toUpperCase(),
                type: 'ENCHANT',
                price: prices[`ENCHANTMENT_${name.toUpperCase()}_${value}`] ?? 0,
                count: 1,
            };
            item.price = calculationData.price;
            item.calculation.push(calculationData);
            item.itemName = SPECIAL_ENCHANTMENT_NAMES[name] || titleCase(name.replace(/_/g, ' '));
        } else {
            // MULTI ENCHANTMENT BOOK
            let enchantmentPrice = 0;
            for (const [name, value] of Object.entries(item.extraAttributes.enchantments)) {
                const calculationData = {
                    id: `${name}_${value}`.toUpperCase(),
                    type: 'ENCHANT',
                    price: (prices[`ENCHANTMENT_${name.toUpperCase()}_${value}`] ?? 0) * APPLICATION_WORTH.enchants,
                    count: 1,
                };
                enchantmentPrice += calculationData.price;
                item.calculation.push(calculationData);
            }
            item.price = enchantmentPrice;
        }
    }
}

module.exports = EnchantedBookHandler;
