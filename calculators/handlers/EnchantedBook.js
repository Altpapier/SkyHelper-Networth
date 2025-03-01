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
        return item.itemId === 'ENCHANTED_BOOK' && Object.keys(item.extraAttributes.enchantments || {}).length > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const isSingleEnchantBook = Object.keys(item.extraAttributes.enchantments).length === 1;
        let enchantmentPrice = 0;
        for (const [name, value] of Object.entries(item.extraAttributes.enchantments)) {
            const price = prices[`ENCHANTMENT_${name.toUpperCase()}_${value}`];
            if (!price) {
                continue;
            }
            const calculationData = {
                id: `${name}_${value}`.toUpperCase(),
                type: 'ENCHANT',
                price: price * (isSingleEnchantBook ? 1 : APPLICATION_WORTH.enchantments),
                count: 1,
            };
            enchantmentPrice += calculationData.price;
            item.calculation.push(calculationData);

            if (isSingleEnchantBook) {
                item.itemName = SPECIAL_ENCHANTMENT_NAMES[name] || titleCase(name.replace(/_/g, ' '));
            }
        }
        if (enchantmentPrice) {
            item.price = enchantmentPrice;
        }
    }
}

module.exports = EnchantedBookHandler;
