const { calculateItemNetworth } = require('./helper/calculateNetworth');
const { parsePrices } = require('./helper/prices');
const { validateItem } = require('./helper/validate');

const networthManager = require('./NetworthManager');

class ItemNetworthCalculator {
    /**
     * Creates a new ItemNetworthCalculator
     * @param {object} itemData The item the networth should be calculated for
     */
    constructor(itemData) {
        this.itemData = itemData;
        validateItem(this.itemData);
    }

    /**
     * Returns the networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's networth calculation
     */
    async getNetworth(prices) {
        return this.#calculate(prices, false);
    }

    /**
     * Returns the non cosmetic networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's non cosmetic networth calculation
     */
    async getNonCosmeticNetworth(prices) {
        return this.#calculate(prices, true);
    }

    async #calculate(prices, nonCosmetic) {
        const parsedPrices = await parsePrices(prices, networthManager.cachePrices, networthManager.pricesRetries);
        await networthManager.itemsPromise;
        return calculateItemNetworth(this.itemData, parsedPrices, networthManager.includeItemData, nonCosmetic);
    }
}

module.exports = { ItemNetworthCalculator };
