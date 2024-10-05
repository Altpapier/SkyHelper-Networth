const networthManager = require('../managers/NetworthManager');
const ItemNetworthHelper = require('./helpers/ItemNetworthHelper');
const handlers = require('./helpers/handlers');
const { getPrices } = require('../helper/prices');

/**
 * Class for calculating the networth of an item
 */
class ItemNetworthCalculator extends ItemNetworthHelper {
    /**
     * Returns the networth of an item
     * @param {object} options Options for the calculation
     * @param {object} [options.prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @param {boolean} [options.includeItemData] Whether to include item data in the result
     * @returns {object} An object containing the item's networth calculation
     */
    async getNetworth({ prices, cachePrices, pricesRetries, includeItemData } = {}) {
        return await this.#calculate({ prices, nonCosmetic: false, cachePrices, pricesRetries, includeItemData });
    }

    /**
     * Returns the non-cosmetic networth of an item
     * @param {object} options Options for the calculation
     * @param {object} [options.prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @param {boolean} [options.includeItemData] Whether to include item data in the result
     * @returns {object} An object containing the item's networth calculation
     */
    async getNonCosmeticNetworth({ prices, cachePrices, pricesRetries, includeItemData } = {}) {
        return await this.#calculate({ prices, nonCosmetic: true, cachePrices, pricesRetries, includeItemData });
    }

    /**
     * Calculates the networth of an item
     * @param {object} options Options for the calculation
     * @param {object} [options.prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {boolean} [options.nonCosmetic] Whether to calculate the non-cosmetic networth
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @param {boolean} [options.includeItemData] Whether to include item data in the result
     * @returns An object containing the item's networth calculation
     */
    async #calculate({ prices, nonCosmetic, cachePrices, pricesRetries, includeItemData }) {
        // Set default values
        this.nonCosmetic = nonCosmetic; // Can be a bit confusing I thought the item was non cosmetic not the calculation. Suggestions?
        cachePrices ??= networthManager.cachePrices;
        pricesRetries ??= networthManager.pricesRetries;
        includeItemData ??= networthManager.includeItemData;

        // Get prices
        await networthManager.itemsPromise;
        if (!prices) {
            prices = await getPrices(cachePrices, pricesRetries);
        }

        // Get the base price for the item
        this.getBasePrice(prices);

        for (const Handler of handlers) {
            // Create a new instance of the handler
            const handler = new Handler();
            // Check if the handler applies to the item
            if (!handler.applies(this)) {
                continue;
            }

            // Calculate the price of this modifier
            handler.calculate(this, prices);
        }

        const data = {
            name: this.itemName,
            loreName: this.itemData.tag.display.Name,
            id: this.itemId,
            price: this.price,
            base: this.base,
            calculation: this.calculation,
            count: this.itemData.Count || 1,
            soulbound: this.isSoulbound(),
        };
        return includeItemData ? { ...data, item: this.itemData } : data;
    }
}

module.exports = ItemNetworthCalculator;
