const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for a Rune on an item.
 */
class RuneHandler {
    /**
     * Checks if the handler is cosmetic
     * @returns {boolean} Whether the handler is cosmetic
     */
    isCosmetic() {
        return true;
    }

    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return Object.keys(item.extraAttributes.runes ?? {}).length > 0 && !item.itemId.startsWith('RUNE');
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const [runeType, runeTier] = Object.entries(item.extraAttributes.runes)[0];
        const runeId = `${runeType}_${runeTier}`;
        if (prices[`RUNE_${runeId}`]) {
            const calculationData = {
                id: `RUNE_${runeId}`,
                type: 'RUNE',
                price: (prices[`RUNE_${runeId}`] ?? 0) * APPLICATION_WORTH.runes,
                count: 1,
            };
            item.calculation.push(calculationData);
        }
    }
}

module.exports = RuneHandler;
