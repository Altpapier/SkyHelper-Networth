const networthManager = require('../managers/NetworthManager');
const SkyBlockItemNetworthHelper = require('./helpers/SkyBlockItemNetworthHelper');
const handlers = require('./helpers/handlers');
const { getPrices } = require('../helper/prices');

// @ts-check

/**
 * @typedef {import('../types/SkyBlockItemNetworthCalculator').SkyBlockItemNetworthCalculator} SkyBlockItemNetworthCalculator
 * @typedef {import('../types/SkyBlockItemNetworthCalculator').Item} NetworthResult
 * @typedef {import('../types/global').NetworthOptions} NetworthOptions
 */

/**
 * SkyBlockItemNetworthCalculator class.
 * Calculates the networth of an item.
 * @implements {SkyBlockItemNetworthCalculator}
 */
class SkyBlockItemNetworthCalculator extends SkyBlockItemNetworthHelper {
    /**
     * Gets the networth of the player.
     * @param {NetworthOptions} [options] The options for calculating networth.
     * @returns {Promise<NetworthResult>} The networth result.
     */
    async getNetworth(options) {
        return await this.#calculate({ ...options, nonCosmetic: false });
    }

    /**
     * Gets the networth of the player without the cosmetic items.
     * @param {NetworthOptions} [options] The options for calculating networth.
     * @returns {Promise<NetworthResult>} The networth result.
     */
    async getNonCosmeticNetworth(options) {
        return await this.#calculate({ ...options, nonCosmetic: true });
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
    async #calculate({ prices, nonCosmetic, cachePrices, pricesRetries, cachePricesTime, includeItemData }) {
        // Set default values
        this.nonCosmetic = nonCosmetic;
        cachePrices ??= networthManager.getCachePrices();
        pricesRetries ??= networthManager.getPricesRetries();
        cachePricesTime ??= networthManager.getCachePricesTime();
        includeItemData ??= networthManager.getIncludeItemData();

        // Get prices
        await networthManager.itemsPromise;
        if (!prices) {
            prices = await getPrices(cachePrices, pricesRetries, cachePricesTime);
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

            // Check if the handler is cosmetic, if it is and we are calculating non-cosmetic networth, skip it
            if (typeof handler.isCosmetic === 'function' && handler.isCosmetic() && this.nonCosmetic) {
                continue;
            }

            // Calculate the price of this modifier
            handler.calculate(this, prices);
        }

        if (this.isCosmetic() && this.nonCosmetic) {
            return;
        }

        const data = {
            name: this.itemName,
            loreName: this.itemData.tag.display.Name,
            id: this.extraAttributes.id,
            customId: this.itemId,
            price: this.price + this.basePrice,
            basePrice: this.basePrice,
            calculation: this.calculation,
            count: this.itemData.Count ?? 1,
            soulbound: this.isSoulbound(),
            cosmetic: this.isCosmetic(),
        };
        return includeItemData ? { ...data, item: this.itemData } : data;
    }
}

module.exports = SkyBlockItemNetworthCalculator;
