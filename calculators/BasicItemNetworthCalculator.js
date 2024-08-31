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
        this.amount = amount;
        this.skyblockItem = getHypixelItemInformationFromId(this.id) ?? {};
        this.itemName = this.skyblockItem.name || titleCase(this.id).split(' ').reverse().join(' '); //TODO: i think this was only needed for essence?

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

    /**
     * Returns the networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {object} options Options for the calculation
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @returns {object} An object containing the item's networth calculation
     */
    async getNetworth(prices, { cachePrices, pricesRetries }) {
        return await this.#calculate(prices, { nonCosmetic: false, cachePrices, pricesRetries });
    }

    /**
     * Returns the non-cosmetic networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {object} options Options for the calculation
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @returns {object} An object containing the item's networth calculation
     */
    async getNonCosmeticNetworth(prices, { cachePrices, pricesRetries }) {
        return await this.calculate(prices, { nonCosmetic: true, cachePrices, pricesRetries });
    }

    /**
     * Calculates the networth of an item
     * @param {object} prices A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {object} options Options for the calculation
     * @param {boolean} [options.nonCosmetic] Whether to calculate the non-cosmetic networth
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @returns An object containing the item's networth calculation
     */
    async #calculate(prices, { nonCosmetic, cachePrices, pricesRetries }) {
        // Set default values
        cachePrices ??= networthManager.cachePrices;
        pricesRetries ??= networthManager.pricesRetries;

        // Get prices
        await networthManager.itemsPromise;
        if (!prices) {
            prices = await getPrices(cachePrices, pricesRetries);
        }

        // Get the base price for the item
        const itemPrice = prices[this.id] || 0;
        if (!itemPrice) {
            return null;
        }

        return {
            name: this.itemName,
            id: this.id,
            price: itemPrice * this.amount,
            calculation: [],
            count: this.amount,
            soulbound: false,
        };
    }
}

module.exports = BasicItemNetworthCalculator;
