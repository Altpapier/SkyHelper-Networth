/**
 * A handler for Crown of Avarice Coins Collected modifier on an item.
 */
class AvariceCoinsCollectedHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.collected_coins > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const zeroPrice = prices['CROWN_OF_AVARICE'] ?? 0;
        const billionPrice = prices['CROWN_OF_AVARICE_1B'] ?? 0;
        const coinsCollected = Math.min(item.extraAttributes.collected_coins, 1_000_000_000);
        const newPrice = zeroPrice + (billionPrice - zeroPrice) * (coinsCollected / 1_000_000_000);

        const calculationData = {
            id: 'CROWN_OF_AVARICE',
            type: 'CROWN_OF_AVARICE',
            price: newPrice,
            count: coinsCollected,
        };
        item.basePrice = calculationData.price;
        item.calculation.push(calculationData);
    }
}

module.exports = AvariceCoinsCollectedHandler;
