const ItemNetworthCalculator = require('./ItemNetworthCalculator');
const PetNetworthCalculator = require('./PetNetworthCalculator');
const networthManager = require('../managers/NetworthManager');
const { ValidationError } = require('../helper/errors');
const { getPrices } = require('../helper/prices');

// @ts-check

/**
 * @typedef {import('../types/ItemNetworthCalculator').ItemNetworthCalculator} ItemNetworthCalculator
 * @typedef {import('../types/ItemNetworthCalculator').Item} NetworthResult
 * @typedef {import('../types/global').NetworthOptions} NetworthOptions
 */

/**
 * ItemNetworthCalculator class.
 * Calculates the networth of an item.
 * @implements {ItemNetworthCalculator}
 */
class GenericItemNetworthCalculator {
    constructor(item) {
        this.item = item;
    }

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
        // Set default options
        cachePrices ??= networthManager.getCachePrices();
        pricesRetries ??= networthManager.getPricesRetries();
        cachePricesTime ??= networthManager.getCachePricesTime();
        includeItemData ??= networthManager.getIncludeItemData();

        if (!prices) {
            prices = await getPrices(cachePrices, pricesRetries, cachePricesTime);
        }

        // Get the calculator for the item
        let calculatorClass = ItemNetworthCalculator;
        /**
         * @type {ItemNetworthCalculator | PetNetworthCalculator | BasicItemNetworthCalculator}
         */

        if (this.item.tag?.ExtraAttributes?.petInfo || this.item.exp !== undefined) {
            try {
                this.item = this.item.tag?.ExtraAttributes?.petInfo ? JSON.parse(this.item.tag.ExtraAttributes.petInfo) : this.item;
                calculatorClass = PetNetworthCalculator;
            } catch {}
        } else if (!this.item.tag?.ExtraAttributes && this.item.exp === undefined && typeof this.item.id !== 'string') {
            throw new ValidationError('Invalid item data.');
        }

        const calculator = new calculatorClass(this.item);
        return await calculator.getNetworth({ prices, nonCosmetic, includeItemData });
    }
}

module.exports = GenericItemNetworthCalculator;
