const { getHypixelItemInformationFromId } = require('../constants/itemsMap');
const { ValidationError } = require('../helper/errors');
const { titleCase } = require('../helper/functions');
const { getPrices } = require('../helper/prices');
const networthManager = require('../managers/NetworthManager');

/**
 * Base class for calculating the networth of a basic item like a sack item or essence
 */
class BasicItemNetworthCalculator {
    /**
     * Creates a new BasicItemNetworthCalculator
     * @param {object} itemData The item the networth should be calculated for
     * @param {string} itemData.id The item's id
     * @param {number} itemData.amount The amount of the item
     */
    constructor({ id, amount }) {
        this.id = id;
        this.amount = amount ?? 0;
        this.skyblockItem = getHypixelItemInformationFromId(this.id) ?? {};
        this.itemName = this.#getItemName();

        this.#validate();
    }

    #validate() {
        if (this.id === undefined) {
            throw new ValidationError('Item id is required');
        }

        if (this.amount === undefined) {
            throw new ValidationError('Item amount is required');
        }
    }

    #getItemName() {
        if (this.id.includes('ESSENCE')) {
            return titleCase(this.id).split(' ').reverse().join(' ');
        }

        return this.skyblockItem?.name || titleCase(this.id);
    }

    /**
     * Returns the networth of an item
     * @param {object} options Options for the calculation
     * @param {object} [options.prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @returns {object} An object containing the item's networth calculation
     */
    async getNetworth(options = {}) {
        return await this.#calculate({ ...options, nonCosmetic: false });
    }

    /**
     * Returns the non-cosmetic networth of an item
     * @param {object} options Options for the calculation
     * @param {object} [options.prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @returns {object} An object containing the item's networth calculation
     */
    async getNonCosmeticNetworth(options = {}) {
        return await this.#calculate({ ...options, nonCosmetic: true });
    }

    /**
     * Calculates the networth of an item
     * @param {object} options Options for the calculation
     * @param {object} [options.prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @returns An object containing the item's networth calculation
     */
    async #calculate({ prices, nonCosmetic, cachePrices, pricesRetries, cachePricesTime }) {
        if (!this.amount || this.amount <= 0) return null;

        if (this.id.startsWith('RUNE_') && nonCosmetic) return null;

        // Set default values
        cachePrices ??= networthManager.getCachePrices();
        pricesRetries ??= networthManager.getPricesRetries();
        cachePricesTime ??= networthManager.getCachePricesTime();

        // Get prices
        await networthManager.itemsPromise;
        if (!prices) {
            prices = await getPrices(cachePrices, pricesRetries, cachePricesTime);
        }

        // Get the base price for the item
        const itemPrice = prices[this.id];
        if (!itemPrice) {
            return null;
        }

        const totalPrice = itemPrice * this.amount;
        if (totalPrice < 0.1) {
            return null;
        }

        return {
            name: this.itemName,
            id: this.id,
            price: totalPrice,
            calculation: [],
            count: this.amount,
            soulbound: false,
        };
    }
}

module.exports = BasicItemNetworthCalculator;
