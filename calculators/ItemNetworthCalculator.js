const { calculateItemNetworth } = require('../helper/calculateNetworth');
const { parsePrices } = require('../helper/prices');

const networthManager = require('./NetworthManager');

class ItemNetworthCalculator {
    /**
     * Creates a new ItemNetworthCalculator
     * @param {object} itemData The item the networth should be calculated for
     */
    constructor(itemData) {
        this.itemData = itemData;
        this.#validate();
    }

    #validate() {
        if (!this.itemData || typeof this.itemData !== 'object') {
            throw new ValidationError('Item must be an object');
        }

        if (this.itemData?.tag === undefined && this.itemData?.exp === undefined) {
            throw new ValidationError('Invalid item provided');
        }
    }

    /**
     * Returns the networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's networth calculation
     */
    async getNetworth(prices, { cachePrices, pricesRetries, includeItemData }) {
        return this.#calculate(prices, { cachePrices, pricesRetries, includeItemData }, false);
    }

    /**
     * Returns the non cosmetic networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's non cosmetic networth calculation
     */
    async getNonCosmeticNetworth(prices, { cachePrices, pricesRetries, includeItemData }) {
        return this.#calculate(prices, { cachePrices, pricesRetries, includeItemData }, true);
    }

    async #calculate(prices, { cachePrices, pricesRetries, includeItemData }, nonCosmetic) {
        const parsedPrices = await parsePrices(prices, cachePrices ?? networthManager.cachePrices, pricesRetries ?? networthManager.pricesRetries);
        await networthManager.itemsPromise;
        return calculateItemNetworth(this.itemData, parsedPrices, includeItemData ?? networthManager.includeItemData, nonCosmetic);
    }
}

module.exports = { ItemNetworthCalculator };
